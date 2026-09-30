import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { 
  Mail, 
  LogOut
} from 'lucide-react';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
        <p className="text-sm font-semibold text-slate-600">Loading profile details...</p>
      </div>
    );
  }

  // Fallback state if user is unauthenticated
  const user = session?.user || {
    name: 'Travel Enthusiast',
    email: 'user@example.com',
    image: null,
  };

  const userFirstName = user.name ? user.name.split(' ')[0] : 'User';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-800 antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="px-10 md:px-15 py-5 sm:px-6 lg:px-8">
          <Nav />
        </div>
      </header>


      <main className="grow w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8 mt-20">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Account Details</h1>
          <p className="text-sm text-slate-500">Manage and view your profile information.</p>
        </div>
        <div className="rounded-3xl text-black p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6 mt-10">

          <div className="relative z-10 shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'User picture'}
                className="h-24 w-24 rounded-full border-4 border-white/20 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-500 text-slate-950 text-3xl font-black border-4 border-white/20 shadow-lg">
                {userFirstName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="relative z-10 text-center sm:text-left space-y-2 grow">
            <h2 className="text-2xl font-bold  text-slate-700">{user.name}</h2>
            <p className="text-sm text-slate-700 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-4 w-4 text-teal-400" /> {user.email}
            </p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-50">
          <div>
            <h4 className="font-bold text-slate-900">Sign Out of Account</h4>
            <p className="text-xs text-slate-500">Safely terminate your active Sajhedar session on this browser.</p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="inline-flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 px-5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}