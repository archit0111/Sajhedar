import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-8">
      <Head>
        <title>Trip Expense Manager</title>
      </Head>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center leading-tight">Welcome to Trip Expense Manager</h1>
      <p className="mb-8 text-base sm:text-lg md:text-xl text-gray-700 text-center max-w-md">Easily split and manage your group travel expenses</p>
      <button
        onClick={() => signIn('google')}
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-base sm:text-lg font-semibold"
      >
        Sign in with Google
      </button>
    </div>
  );
} 