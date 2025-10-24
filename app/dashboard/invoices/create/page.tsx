import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/invoices/create-form';
import { Suspense } from 'react';
import { fetchCustomers } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true },
        ]}
      />
      <div className="mt-6">
        <Suspense fallback={<InvoicesTableSkeleton />}>
          <CreateInvoiceServerArea />
        </Suspense>
      </div>
    </main>
  );
}

async function CreateInvoiceServerArea() {
  const customers = await fetchCustomers();
  return <Form customers={customers} />;
}
