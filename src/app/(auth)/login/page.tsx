import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import FampoLogo from '@/components/FampoLogo';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <FampoLogo size={48} className="rounded-lg shadow-md" />
            <span className="text-2xl font-semibold text-zinc-900">Fampo</span>
          </div>
        </div>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

