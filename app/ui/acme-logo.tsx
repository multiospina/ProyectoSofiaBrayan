import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`${lusitana.className} flex items-center gap-3 ${className}`}>
      {/* Logo image stored in public/ImageAmigurumi/dsm-logo.png */}
      <div className="logo-icon-wrapper inline-flex items-center justify-center w-11 h-11 rounded-full bg-transparent overflow-hidden">
        <Image
          src="/ImageAmigurumi/dsm-logo.png"
          alt="DSM logo"
          width={44}
          height={44}
          priority
        />
      </div>

      <div className="logo-text leading-none">
        <div className="text-2xl font-extrabold text-pink-700 select-none">DSM</div>
        <div className="text-xs font-medium text-pink-400 -mt-1 select-none">Amigurumis</div>
      </div>
    </div>
  );
}
