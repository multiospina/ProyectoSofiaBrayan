'use client';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function GreetingRotator() {
  const messages = [
    '¡Bienvenidos a DSM!',
    'Hecho con cariño por Diana, Sofía y Miguel',
    'Amigurumis únicos, hechos a mano',
    'Tu sonrisa es nuestro mejor patrón'
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`${styles.welcomeTitle} ${lusitana.className} text-2xl md:text-3xl font-extrabold`}>
        {messages[idx]}
      </div>
      <div className={styles.slogan + ' mt-2'}>
        DSM — Diana · Sofía · Miguel
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className={`relative flex min-h-screen flex-col p-6 ${styles.pageBg}`}>
      <div className={styles.shape} />



      <div className="mt-6 flex grow flex-col gap-6 md:flex-row z-20">
        <div
          className={`left-panel flex flex-col items-center justify-center gap-4 rounded-lg px-6 py-6 md:w-2/5 md:px-12 ${styles.heroCard} ${styles.fadeInUp}`}
        >
          <div className="w-full flex justify-center">
            <div className="logo-container">
              <AcmeLogo className="logo-inner" />
            </div>
          </div>

          <div className="w-full mt-2 flex flex-col items-center text-center">
            <GreetingRotator />

            <p className={styles.welcomeText + ' mt-3 text-sm md:text-base'}>
              Tienda de amigurumis hechos a mano. Revisa pedidos, crea facturas y gestiona tu inventario.
            </p>
          </div>

          <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link href="/login" className={styles.btnPink}>
              <span>Iniciar sesión</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>

            <Link href="/register" className="secondaryLink">
              Crear cuenta
            </Link>

            <Link
              href="/dashboard"
              className={styles.btnDashboard}
              aria-label="Ver el dashboard"
            >
              Ver el dashboard
            </Link>
          </div>

          <div className="w-full mt-2 text-xs text-pink-300 text-center">
            Demo con paleta pastel rosada — los datos son de ejemplo.
          </div>
        </div>

        <div className="flex items-center justify-center p-4 md:w-3/5 md:px-8">
          <div className={styles.heroMedia}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Image src="/ImageAmigurumi/amigurumi-1.png" width={320} height={320} alt="Amigurumi 1" className="rounded-lg object-cover" />
              <Image src="/ImageAmigurumi/amigurumi-2.jpeg" width={320} height={320} alt="Amigurumi 2" className="rounded-lg object-cover" />
              <Image src="/ImageAmigurumi/amigurumi-3.jpg" width={320} height={320} alt="Amigurumi 3" className="rounded-lg object-cover" />
              <Image src="/ImageAmigurumi/amigurumi-4.jpg" width={320} height={320} alt="Amigurumi 4" className="rounded-lg object-cover" />
              <Image src="/ImageAmigurumi/amigurumi-5.jpg" width={320} height={320} alt="Amigurumi 5" className="rounded-lg object-cover" />
              <Image src="/ImageAmigurumi/amigurumi-6.jpg" width={320} height={320} alt="Amigurumi 6" className="rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
