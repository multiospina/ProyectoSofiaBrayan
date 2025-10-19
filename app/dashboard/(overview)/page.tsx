import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  return (
    <main>
      {/* Título principal */}
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {/* =============================
          SECCIÓN 1: CARDS (tarjetas)
          ============================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* 🔸 Carga suspendida de tarjetas */}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* =============================
          SECCIÓN 2: GRÁFICO + INVOICES
          ============================= */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 🔸 Carga suspendida del gráfico de ingresos */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        {/* 🔸 Carga suspendida de las últimas facturas */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

