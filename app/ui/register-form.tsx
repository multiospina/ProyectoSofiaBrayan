'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { createUser } from '@/app/lib/actions';
import { Button } from './button';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function RegisterForm() {
  const [error, formAction, isPending] = useActionState(createUser, undefined);

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-lg animate-fade-in rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50/60 p-1 shadow-lg"
    >
      <div className="overflow-hidden rounded-2xl bg-white px-8 py-10 sm:px-10">
        <h2 className="mb-2 text-center text-2xl font-semibold text-rose-600">
          Crea tu cuenta
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Únete y comienza a gestionar tus facturas al instante
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Nombre completo</span>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition focus:border-rose-300 focus:shadow-outline focus:outline-none"
              placeholder="María Pérez"
              aria-label="Nombre completo"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Correo</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition focus:border-rose-300 focus:shadow-outline focus:outline-none"
              placeholder="tú@ejemplo.com"
              aria-label="Correo"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Contraseña</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition focus:border-rose-300 focus:shadow-outline focus:outline-none"
              placeholder="Al menos 6 caracteres"
              aria-label="Contraseña"
            />
          </label>
        </div>

        <input type="hidden" name="redirectTo" value="/dashboard" />

        <div className="mt-6">
          <Button
            className={clsx(
              'flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-transform text-white',
              isPending ? 'cursor-wait bg-rose-400 scale-99' : 'bg-rose-500 hover:-translate-y-0.5'
            )}
            aria-disabled={isPending}
          >
            {isPending ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Creando...
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </div>

        <div
          className="mt-4 flex items-start gap-2 text-sm"
          aria-live="polite"
          aria-atomic="true"
        >
          {error ? (
            <div className="flex w-full items-center gap-2 rounded-md border border-rose-100 bg-rose-50/80 px-3 py-2">
              <ExclamationCircleIcon className="h-5 w-5 text-rose-600" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Al crear una cuenta aceptas nuestros términos.</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <p className="text-sm text-gray-600">¿Ya tienes una cuenta?</p>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            aria-label="Ir a iniciar sesión"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </form>
  );
}
