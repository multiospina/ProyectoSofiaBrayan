'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import sql from './data';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Validación de facturas
const FormSchema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string().optional(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Crear factura
export async function createInvoice(formData: FormData): Promise<void> {
  const parsed = CreateInvoice.parse({
    customerId: String(formData.get('customerId') ?? ''),
    amount: formData.get('amount'),
    status: String(formData.get('status') ?? ''),
  });

  const { customerId, amount, status } = parsed;
  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Actualizar factura
export async function updateInvoice(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const parsed = CreateInvoice.parse({
    customerId: String(formData.get('customerId') ?? ''),
    amount: formData.get('amount'),
    status: String(formData.get('status') ?? ''),
  });

  const { customerId, amount, status } = parsed;
  const amountInCents = Math.round(amount * 100);

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Eliminar factura
export async function deleteInvoice(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  await sql`DELETE FROM invoices WHERE id = ${id}`;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Autenticación de usuario
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// Registro de usuario
const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function createUser(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return 'Invalid input. Please check your data.';
  }

  const { name, email, password } = parsed.data;

  // ⚠️ Aquí deberías hashear la contraseña antes de guardarla
  // Ejemplo: const hashed = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
  `;

  redirect('/login');
}
