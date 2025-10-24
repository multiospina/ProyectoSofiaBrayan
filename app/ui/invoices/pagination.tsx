'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('page', pageNumber.toString());
    return `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const pages = generatePagination(totalPages, currentPage);

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center" aria-label="Pagination">
      <div className="flex items-center">
        <PaginationArrow
          href={createPageURL(prevPage)}
          direction="left"
          isDisabled={currentPage === 1}
        />

        <div className="flex items-center rounded-md border">
          {pages.map((p, idx) => {
            const isEllipsis = typeof p === 'string' && p === '...';
            const pageNumber = typeof p === 'number' ? p : p;
            const position =
              pages.length === 1
                ? 'single'
                : idx === 0
                ? 'first'
                : idx === pages.length - 1
                ? 'last'
                : 'middle';

            if (isEllipsis) {
              return (
                <div
                  key={`ellipsis-${idx}`}
                  className="flex h-10 w-10 items-center justify-center text-sm border text-gray-400"
                >
                  …
                </div>
              );
            }

            const href = createPageURL(pageNumber as number);
            const isActive = Number(pageNumber) === currentPage;

            return (
              <PaginationNumber
                key={String(pageNumber) + idx}
                page={pageNumber}
                href={href}
                isActive={isActive}
                position={position as 'first' | 'last' | 'middle' | 'single'}
              />
            );
          })}
        </div>

        <PaginationArrow
          href={createPageURL(nextPage)}
          direction="right"
          isDisabled={currentPage === totalPages}
        />
      </div>
    </nav>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
