'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

import { authenticate } from '@/app/lib/actions';
import { Button } from './button';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="mx-auto w-full max-w-md animate-fade-in rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50/60 p-1 shadow-lg">
      <div className="overflow-hidden rounded-2xl bg-white px-8 py-8 sm:px-10">
        <h1 className="mb-1 text-center text-2xl font-semibold text-rose-600">
          Inicia sesión
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Ingresa con tu correo y contraseña
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Correo</span>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tú@ejemplo.com"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 shadow-sm transition focus:border-rose-300 focus:shadow-outline focus:outline-none"
                aria-label="Correo"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Contraseña</span>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Al menos 6 caracteres"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pl-10 text-sm text-gray-700 shadow-sm transition focus:border-rose-300 focus:shadow-outline focus:outline-none"
                aria-label="Contraseña"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </label>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

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
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Iniciando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRightIcon className="ml-auto h-5 w-5 text-white" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex items-start gap-2 text-sm" aria-live="polite" aria-atomic="true">
          {errorMessage ? (
            <div className="flex w-full items-center gap-2 rounded-md border border-rose-100 bg-rose-50/80 px-3 py-2">
              <ExclamationCircleIcon className="h-5 w-5 text-rose-600" />
              <p className="text-sm text-rose-700">{errorMessage}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">¿No tienes cuenta? Regístrate abajo.</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <Link href="/register" className="inline-flex w-full items-center justify-center rounded-lg border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
            Crear cuenta
          </Link>

          <Link href="/forgot-password" className="ml-2 text-sm text-gray-500 hover:text-rose-600">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </form>
  );
}
