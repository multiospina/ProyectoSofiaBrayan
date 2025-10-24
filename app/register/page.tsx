import RegisterForm from '@/app/ui/register-form';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-pink-25 p-6">
      <div className="w-full max-w-5xl px-4">
        <div className="mx-auto max-w-2xl">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}