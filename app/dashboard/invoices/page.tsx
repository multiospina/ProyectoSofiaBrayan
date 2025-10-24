import Search from '@/app/ui/search';
import Pagination from '@/app/ui/invoices/pagination';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchInvoicesPages } from '@/app/lib/data';

type Props = {
  searchParams?: {
    query?: string;
    page?: string;
  } | Promise<{
    query?: string;
    page?: string;
  }>;
};

export default function Page(props: Props) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<div className="h-10 w-44 rounded bg-gray-100" />}>
          <Search placeholder="Search invoices..." />
        </Suspense>
        <CreateInvoice />
      </div>

      <div className="mt-6">
        <Suspense fallback={<InvoicesTableSkeleton />}>
          <InvoicesServerArea searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function InvoicesServerArea({ searchParams }: { searchParams?: Props['searchParams'] }) {
  const resolved = await (searchParams ?? Promise.resolve({}));
  const query = (resolved as any)?.query || '';
  const currentPage = Number((resolved as any)?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <>
      <Table query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
