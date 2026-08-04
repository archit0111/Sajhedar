import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Coins,
  Users,
  Plus,
  Receipt,
  TrendingUp,
  Clock,
  UserPlus,
  TrendingDown,
  Edit
} from 'lucide-react';
import { ITrip } from '@/models/Trip';
import AddExpanseModal from '@/components/AddExpanseModal';
import { IExpense } from '@/models/Expense';

// Demo Trip Data matching your exact schema structure
const demoTrip = {
  _id: "trip_84f9b2c3d1e0",
  name: "Euro Summer 2026 🇪🇺",
  startDate: "2026-07-15",
  endDate: "2026-07-30",
  currency: "EUR",
  members: [
    { name: "You" },
    { name: "Rahul K." },
    { name: "Sneha M." },
    { name: "Aman Verma" }
  ]
};

const tripExpenses = [
  { id: 'exp_1', description: 'AirBnB Barcelona Booking', totalAmount: 450, paidBy: 'You', date: 'Jul 16' },
  { id: 'exp_2', description: 'Tapas Dinner & Sangria', totalAmount: 120, paidBy: 'Rahul K.', date: 'Jul 18' },
  { id: 'exp_3', description: 'Train Tickets to Madrid', totalAmount: 180, paidBy: 'Sneha M.', date: 'Jul 20' },
  { id: 'exp_4', description: 'Museum Entry Passes', totalAmount: 60, paidBy: 'You', date: 'Jul 22' },
];


export default function TripDetailsPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<ITrip>();
  const router = useRouter();
  const { id } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState<IExpense[]>([]);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!session || !id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/trips/${id}`);
        const trip = await res.json();
        if (!res.ok) {
          throw Error(trip.message);
        }
        setTrip(trip);
      } catch (e: any) {
        setError(e || 'Some error occured')
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [session, id])

  const fetchExpanses = async ()=>{
    if (!session || !id || id === 'undefined') return;
      try {
        const res = await fetch(`/api/trips/${id}/expenses`);
        const expenses = await res.json();
        if (!res.ok) {
          console.log("Error in fetching expanses!",res);
        }
        setExpenses(expenses);
      } catch (e) {
        console.log("error in fetching expanses", e);
      }
  }

  useEffect(() => {
    fetchExpanses();
  }, [session, id])

  const onClose = () => {
    setIsOpen(prev => !prev);
  }
  const totalTripSpend = tripExpenses.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const sharePerPerson = trip?.members?.length! > 0 && trip?.members?.length != undefined && totalTripSpend > 0 ? totalTripSpend / trip?.members?.length : 0;


  return (
    <div className="min-h-screen bg-gradient-to-bl from-emerald-50/60 via-slate-50 to-amber-50/50 text-slate-800 font-sans antialiased">
      <AddExpanseModal id={id ? String(id) : null} isOpen={isOpen} onClose={onClose} onExpenseAdded={fetchExpanses}/>
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors group text-sm font-medium">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-xl transition-all text-sm border border-slate-200">
              <UserPlus size={16} />
              <span>Invite</span>
            </button>
            <button onClick={onClose}
              className="flex cursor-pointer items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm active:scale-95 text-sm">
              <Plus size={16} />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </header>

      {loading ? <div className='flex items-center h-screen text-bold text-teal-800 justify-center'>
        Loading Info...
      </div> : <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Main Header / Info Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 my-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
            <Coins size={180} className="text-slate-900" />
          </div>

          <div className="relative z-10 space-y-3">
            <span className="text-xs font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Trip ID: {id}
            </span>
            <h1 className="text-3xl pt-1 pl-2 font-bold tracking-tight text-teal-900">
              {trip?.name}
            </h1>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600 pt-1">
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl">
                <Calendar size={16} className="text-emerald-600" />
                <span>{trip?.startDate ? format(new Date(trip?.startDate).toLocaleDateString(), 'dd MMM yyyy') : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl">
                <Coins size={16} className="text-amber-500" />
                <span>Currency: <strong className="text-slate-900 font-semibold">{trip?.currency}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Cards Panel */}
        <div className={`${!true ? "grid" : 'hidden'} grid-cols-1 md:grid-cols-3 gap-5 mb-20`}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Group Spending</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{trip?.currency} {totalTripSpend}</p>
          </div>

          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Your Net Balance</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-bold text-emerald-600">+ {trip?.currency} 255</span>
                {true ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-red-400" />}
              </div>
            </div>
          </div>
        </div>

        <div className="justify-center items-center flex">
          <button onClick={onClose}
            className="flex cursor-pointer items-center space-x-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-3 my-5 mb-8 rounded-lg transition-all duration-200 shadow-sm active:scale-95 text-sm">
            <Plus size={18} />
            <span>Add First Expense</span>
          </button>
        </div>

        {/* Content Split: Members & Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Members list*/}
          <div className="space-y-4">
            <div className='flex justify-between pr-10 items-center'>
              <div className="flex items-center space-x-2 px-1">
                <Users size={18} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Trip Members</h2>
              </div>
              <div>
                <button className='flex  items-center gap-1 cursor-pointer'>
                  <Edit size={18} className='text-emerald-600' />
                  <span className='text-lg text-slate-900 font-semibold'>Edit</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 divide-y divide-slate-100 shadow-sm">
              {trip?.members.map((member, index) => (
                <div key={index} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {member.name.substring(0, 2)}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/*Expenses List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Receipt size={18} className="text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Expense History</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">{tripExpenses.length} activities</span>
            </div>

            <div className="space-y-3">
              {expenses?.map((expense: any) => (
                <div
                  key={expense.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex items-center justify-between transition-all shadow-sm group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {expense.description}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Paid by <span className="text-slate-700 font-medium">{expense.paidBy}</span> • {format(new Date(expense.date).toLocaleDateString(), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-950">
                      {trip?.currency} {expense.amount}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Share: {trip?.currency} {(expense.amount / demoTrip.members.length).toFixed(0)} / person
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`${expenses.length===0?'flex':'hidden'} rounded bg-teal-50 items-center justify-center p-4`}>
          <p className='text-teal-800 '>No Expanses added yet..</p>
        </div>
      </main>}
    </div>
  );
}