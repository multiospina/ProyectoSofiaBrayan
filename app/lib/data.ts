import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const RAW_CONN = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? '';

if (!RAW_CONN) {
  throw new Error('POSTGRES_URL or DATABASE_URL environment variable is not defined');
}

function ensureSslmode(url: string) {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('sslmode')) {
      u.searchParams.set('sslmode', 'require');
    }
    return u.toString();
  } catch {
    return url.includes('sslmode=require') ? url : `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
  }
}

const SAFE_CONN = ensureSslmode(RAW_CONN);

const sql = postgres(SAFE_CONN, {
  ssl: { rejectUnauthorized: false },
});

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    return data ?? [];
  } catch (error) {
    console.error('Database Error in fetchRevenue:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 7
    `;
    const latestInvoices = (data ?? []).map((invoice) => ({
      ...invoice,
      amount: formatCurrency(Number(invoice.amount ?? 0)),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error in fetchLatestInvoices:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*)::text AS count FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*)::text AS count FROM customers`;
    const invoiceStatusPromise = sql`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS paid,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS pending
      FROM invoices
    `;

    const [invoiceCountRes, customerCountRes, statusRes] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(invoiceCountRes?.[0]?.count ?? 0);
    const numberOfCustomers = Number(customerCountRes?.[0]?.count ?? 0);
    const totalPaidInvoices = formatCurrency(Number(statusRes?.[0]?.paid ?? 0));
    const totalPendingInvoices = formatCurrency(Number(statusRes?.[0]?.pending ?? 0));

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error in fetchCardData:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = Math.max(0, (currentPage - 1) * ITEMS_PER_PAGE);
  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return invoices ?? [];
  } catch (error) {
    console.error('Database Error in fetchFilteredInvoices:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)::text AS count
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;
    const rawCount = data?.[0]?.count ?? '0';
    const totalItems = Number(rawCount);
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    return totalPages;
  } catch (error) {
    console.error('Database Error in fetchInvoicesPages:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id}
    `;
    const invoice = (data ?? []).map((inv) => ({
      ...inv,
      amount: typeof inv.amount === 'number' ? inv.amount / 100 : 0,
    }));
    console.log(invoice)
    return invoice[0] ?? null;
  } catch (error) {
    console.error('Database Error in fetchInvoiceById:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;
    return customers ?? [];
  } catch (err) {
    console.error('Database Error in fetchCustomers:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id) AS total_invoices,
        COALESCE(SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END), 0) AS total_pending,
        COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END), 0) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
    `;
    const customers = (data ?? []).map((customer) => ({
      ...customer,
      total_pending: formatCurrency(Number(customer.total_pending ?? 0)),
      total_paid: formatCurrency(Number(customer.total_paid ?? 0)),
    }));
    return customers;
  } catch (err) {
    console.error('Database Error in fetchFilteredCustomers:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
export default sql;
