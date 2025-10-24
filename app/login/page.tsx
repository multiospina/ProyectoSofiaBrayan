import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-pink-25 p-6">
      <div className="w-full max-w-3xl px-4">
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
