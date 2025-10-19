import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import InvoicesTable from '@/app/ui/invoices/table';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { fetchFilteredInvoices, fetchInvoicesPages } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  noStore(); // Evita el cacheo de esta ruta si es dinámica

  // ✅ Desempaquetar la promesa:
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Search placeholder="Buscar facturas..." />
      </div>

      <Suspense
        key={query + currentPage}
        fallback={<p className="mt-6 text-gray-500">Cargando facturas...</p>}
      >
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
