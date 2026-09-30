import React from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { 
  Compass, 
  Users, 
  Receipt, 
  Globe2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

export default function AboutUs() {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-amber-500" />,
      title: 'Group Expense Splitting',
      description: 'Add expenses on the fly and let Sajhedar automatically calculate who owes what to whom without awkward math.'
    },
    {
      icon: <Globe2 className="h-6 w-6 text-teal-600" />,
      title: 'Multi-Currency Support',
      description: 'Traveling internationally? Seamlessly log expenses in foreign currencies and convert settlements hassle-free.'
    },
    {
      icon: <Receipt className="h-6 w-6 text-amber-500" />,
      title: 'Transparent Ledger',
      description: 'Every trip member gets a real-time, transparent breakdown of group spending, shared bills, and individual totals.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-teal-600" />,
      title: 'Private & Secure',
      description: 'Your financial data and trip logs are strictly protected with secure authentication.'
    }
  ];

  return (
    <div className="bg-slate-50/60 text-slate-800 ">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className=" px-4 sm:px-6 lg:px-8 py-2">
          <Nav />
        </div>
      </header>

      <main className="grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hero Section */}
        <section>
          <div className='flex justify-center'>
          <div className="font-extrabold flex items-center place-self-center text-white bg-amber-600 rounded-full m-1 text-4xl h-18 p-6.5">S</div>
          </div>
          <div className='flex justify-center'>
            <div className='text-4xl justify-center font-bold'>Sajhedar</div>
          </div>
          <div className='justify-center flex'>
            <p>Making group travel memories, not money conflicts.</p>
          </div>
          <div className='p-10'>
            <div className="bg-white border text-slate-500 border-slate-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md mt-5 justify-center">
            Sajhedar was built to eliminate the stress of calculating shared expenses, splitting bills, and chasing IOUs after vacations—so you can focus on the adventure.
          </div>
          </div>
        </section>

        {/* Origin Story / Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-2xl font-bold uppercase tracking-wider text-teal-700">Our Mission</span>
            <h2 className="text-xl font-bold text-slate-900 pt-4">
              Why we built Sajhedar
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We've all been there and know that a great group trip ends with lot of beautiful memories, but it's followed by chaotic WhatsApp threads, lost paper receipts, and awkward calculations over who paid for dinner vs. hotel.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We created <span className='font-bold'>Sajhedar</span> (meaning <em>Partner/Collaborator</em>) as an intuitive companion to keep group finances crystal clear, transparent, and effortlessly balanced in real-time.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">100% Transparent</h3>
                <p className="text-xs text-slate-500">Zero hidden fees or complicated settlement math.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-200">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Built for Globetrotters</h3>
                <p className="text-xs text-slate-500">Designed specifically for road trips, group vacations, and housemate splits.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything you need to split smart</h2>
            <p className="text-xs sm:text-sm text-slate-500">Simple tools engineered to keep your trip expenses organized.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="p-2.5 w-fit rounded-xl bg-slate-50 border border-slate-100">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For new trips */}
        <section className="rounded-3xl bg-teal-900 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold">Ready for your next trip?</h3>
            <p className="text-teal-200 text-sm">Create a trip group in seconds and invite your friends.</p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-500/95 active:scale-95 transition-all shrink-0"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}