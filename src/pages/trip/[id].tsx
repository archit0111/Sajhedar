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
  TrendingDown,
  Trash2,
} from 'lucide-react';
import { ITrip } from '@/models/Trip';
import AddExpanseModal from '@/components/AddExpanseModal';
import { IExpense } from '@/models/Expense';
import { IDeletedExpense } from '@/models/DeletedExpenses';

interface IMembersWithRemainingAmount {
  id: string,
  name: string,
  totalPaid: number,
  remainingAmount: number
}


export default function TripDetailsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<ITrip>();
  const router = useRouter();
  const { id } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [totalTripSpend, setTotalTripSpend] = useState<number>();
  const [spendByUser, setSpendByUser] = useState<number>()
  const [userRemaningAmount, setUserRemaningAmount] = useState<number>(0)
  const [membersRemainingAmount, setMembersRemaningAmount] = useState<IMembersWithRemainingAmount[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [deletedExpenses, setDeletedExpenses] = useState<IDeletedExpense[]>([]);
  const [UserRole,setUserRole]=useState<string | null >('');

  const toggelButton = (id:string)=>{
    setSelected((prev)=>prev===id?null:id);
  }

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
        roleOfUser(trip);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [session, id])

  const roleOfUser=(trip:ITrip)=>{
    const user = trip.members.find((m:any)=>m.email===session?.user?.email);
    const userRole = String(user?.role);
    setUserRole(userRole);
  }

  const fetchExpanses = async () => {
    if (!session || !id || id === 'undefined') return;
    try {
      const res = await fetch(`/api/trips/${id}/expenses`);
      const expenses = await res.json();
      if (!res.ok) {
        console.log("Error in fetching expanses!", res);
      }
      setExpenses(expenses);
    } catch (e) {
      console.log("error in fetching expanses", e);
    }
  }
  // const fetchPayerDetails = async () => {
  //   try{
  //     const res = fetch('/api/users')
  //   }catch(e){
  //     console.log("error in fetching Payer Details", e);
  //   }
  // }

  useEffect(() => {
    const updateAmountPanel = async () => {
      if (!expenses || !trip || !trip.members) return;
      try {
        const memberCount = trip.members.length || 1;
        const totalAmount = expenses.reduce((acc: number, curr: IExpense) => acc + (Number(curr.amount) || 0), 0);

        // Fair share per person across all expenses
        const fairShare = totalAmount / memberCount;

        const spendByUser = expenses.reduce((acc: number, curr: IExpense) => {
          const isUser = String(curr.payer).toLowerCase() === String(session?.user?.name).toLowerCase();
          return acc + (isUser ? Number(curr.amount) || 0 : 0);
        }, 0);

        setTotalTripSpend(totalAmount);
        setSpendByUser(spendByUser);
        setUserRemaningAmount(spendByUser - fairShare);

        // Calculate paid and net balance for each member
        const membersWithRemainingAmount = trip.members.map((m) => {
          const totalExpenseOfM = expenses.reduce((acc: number, curr: IExpense) => {
            const isPayer = String(curr.payer).toLowerCase() === String(m.name).toLowerCase();
            return acc + (isPayer ? Number(curr.amount) || 0 : 0);
          }, 0);

          // Net balance = Total Paid - Fair Share
          const netBalance = totalExpenseOfM - fairShare;

          return {
            id: m._id ? String(m._id) : (m.userId ? String(m.userId) : ''),
            name: m.name || '',
            totalPaid: Number(totalExpenseOfM.toFixed(0)),
            remainingAmount: Number(netBalance.toFixed(0))
          };
        });

        setMembersRemaningAmount(membersWithRemainingAmount);
      } catch (e) {
        console.error("error in calculating amount", e);
      }
    };

    updateAmountPanel();
  }, [expenses, trip, session]);

  useEffect(() => {
    fetchExpanses();
  }, [session, id]);

  useEffect(() => {

  }, [session, trip, deletedExpenses]);

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const expense = expenses.find((exp)=>exp._id || exp.id === expenseId);
      if(!expense){
        alert("Expense Already Removed!");
        return;
      }
      const res = await fetch(`/api/trips/${id}/expenses/${expenseId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        console.log("Error in deleting expanse!", res);
      }
      if(res.status===403){
        alert('Access not allowed!');
        return;
      }
      const deletedExpense: IDeletedExpense ={
        ...expense,
        remover:session?.user?.name ?? 'UnKnown User',
      } as unknown as IDeletedExpense;
      
      fetchExpanses();
      setDeletedExpenses((prev)=>[...prev,deletedExpense]);
    } catch (e) {
      console.error("Something went wrong!", e);
    }
  }

  useEffect(()=>{
    const fetchDeletedExpense = async()=>{
      try{
        const res = await fetch(`/api/trips/${id}/deleted_expenses`);
        const data = await res.json();
        if(res.ok){
          setDeletedExpenses(data);
        }
      }catch(e){
        console.error("Error in fetching deleted expenses!");
      }
    }
    fetchDeletedExpense();
  },[session,id]);

  const onClose = () => {
    setIsOpen(prev => !prev);
  };

  //API CALLING FOR UPDATING ROLE CHANGE

  const handleRoleChange = async (email:string, newRole:string)=>{
    try{
      const res = await fetch(`/api/trips`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email:email,role:newRole,tripId:id})
      });
      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || 'Failed tp update role');
      }
      setTrip((prev:any)=>{
        if(!prev) return prev;
        return{
          ...prev,
          members:prev.members.map((m:any)=>m.email === email?{...m,role:newRole}:m)
        }
      })
    }catch(e){
      alert('Could not update role!');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-emerald-50/60 via-slate-50 to-amber-50/50 text-slate-800 font-sans antialiased">
      <AddExpanseModal id={id ? String(id) : null} isOpen={isOpen} onClose={onClose} onExpenseAdded={fetchExpanses} />
      {/* <EditMembersModal isOpen={isOpen}  onClose={onClose} trip={trip}/> */}
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors group text-sm font-medium">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center space-x-3">
            {/* <button className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-xl transition-all text-sm border border-slate-200">
              <UserPlus size={16} />
              <span>Invite</span>
            </button> */}
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
      </div> : <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

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
        <div className={`${expenses.length !== 0 ? "grid" : 'hidden'} grid-cols-1 md:grid-cols-3 gap-5 mb-20`}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Group Spending</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{trip?.currency} {totalTripSpend}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">My Spending</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{trip?.currency} {spendByUser}</p>
          </div>

          <div className={`${userRemaningAmount > 0 ? 'bg-emerald-50/40 border-emerald-100' : 'bg-red-50/40 border-red-100'} border rounded-2xl p-6 shadow-sm flex flex-col justify-between`}>
            <div>
              <p className={`text-xs font-semibold ${userRemaningAmount > 0 ? 'text-emerald-700' : 'text-red-700'} tracking-wider uppercase`}>Your Net Balance</p>
              <div className="flex items-center space-x-2 mt-1">
                {userRemaningAmount > 0 ? <div className='flex items-center gap-2'>
                  <span className="text-2xl font-bold text-emerald-600">{'+ '}{trip?.currency} {userRemaningAmount?.toFixed(0)}</span>
                  <TrendingUp size={18} className="text-emerald-500" />
                </div> : <div className='flex items-center gap-2'><span className="text-2xl font-bold text-red-700">{''}{trip?.currency} {userRemaningAmount?.toFixed(0)}</span>
                  <TrendingDown size={18} className="text-red-500" /></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="justify-center items-center flex">
          <button onClick={onClose}
            className="flex cursor-pointer items-center space-x-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-3 my-5 mb-8 rounded-lg transition-all duration-200 shadow-sm active:scale-95 text-sm">
            <Plus size={18} />
            <span>Add Expense</span>
          </button>
        </div>
        

        {/* Members list */}
        <div className="space-y-4">
          <div className="flex justify-between pr-6 items-center">
            <div className="flex items-center space-x-2 px-1">
              <Users size={18} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Trip Members</h2>
            </div>
          </div>

          {membersRemainingAmount?.length !== 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 divide-y divide-slate-100 shadow-sm">
              {trip?.members.map((member, index) => {
                // Look up balance for current member
                const memberData = membersRemainingAmount.find(
                  (m) => m.name.trim().toLowerCase() === member.name?.trim().toLowerCase()
                );
                const amount = memberData?.remainingAmount || 0;
                const spend = memberData?.totalPaid;
                const name = String(memberData?.name);
                const isSelected = String(memberData?.name) === selected;

                return (
                  <div onClick={()=>toggelButton(name)}>
                    <div key={index} className="flex items-center justify-between my-3 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{member.name}</span>
                      {session?.user?.name !== member.name ? <span className='text-sm text-slate-400'>( PAID : {spend} )</span> : null}
                    </div>

                    {/* Formatted Remaining Amount (+ / -) */}
                    <div className="text-right font-semibold text-sm">
                      {amount > 0 && (
                        <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          + {trip?.currency || ''} {amount}
                        </span>
                      )}
                      {amount < 0 && (
                        <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
                          - {trip?.currency || ''} {Math.abs(amount)}
                        </span>
                      )}
                      {amount === 0 && (
                        <span className="text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                          Settled
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`${isSelected?'flex':'hidden'} items-center pl-12 text-slate-500 pb-1`}>role : 
                      {member.role !== 'creator'?UserRole==='creator'?
                      <select 
                      value={member.role?.toLowerCase()}
                      onChange={(e) => handleRoleChange(String(member.email), e.target.value)}
                      className="w-fit px-0.5 ml-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value='member'>Member</option>
                        <option value='admin'>Admin</option>
                      </select>
                      :<span className='text-sm items-center pl-1 text-slate-400'>{member.role}</span>:<span className='text-sm items-center pl-1 text-slate-400'>{member.role}</span>}
                      
                  </div>
                  </div>
                );
              })}
              <div className='mt-2 w-full'><p className='text-slate-400/80 items-center justify-center flex text-sm font-lightbold'>Only Admins are able to add and delete expenses.</p></div>
            </div>
          ) : (
            <div className="flex items-center h-20 bg-teal-100/50 rounded-2xl m-6 text-bold text-teal-800 justify-center">
              Loading Info...
            </div>
          )}
        </div>
        {/*Expenses List */}
        <div className="lg:col-span-2 mt-18 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Receipt size={18} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Expense History</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">{expenses.length} activities</span>
          </div>
          <div className="space-y-3">
            {expenses?.map((expense) => {
              const expenseId = String(expense._id);
              const isSelected = selected === expenseId;
              return(
              <div
                onClick={() => toggelButton(expenseId)}
                key={expenseId}
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
                      Paid by <span className="text-slate-700 font-medium">{expense.payer}</span> • {format(new Date(expense.date).toLocaleDateString(), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-950">
                    {trip?.currency} {expense.amount}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Share: {trip?.currency} {(expense.amount / (trip?.members?.length || 1)).toFixed(0)} / person
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents parent card click from toggling state
                      handleDeleteExpense(String(expense._id));
                    }}
                    className={`${isSelected ? 'flex' : 'hidden'} items-center text-slate-400 text-sm ml-5 mt-1 bg-red-50 p-1 px-2 rounded-2xl place-self-end hover:bg-red-200 hover:text-red-500`}>
                    Delete
                  </button>
                </div>
              </div>)
})}
          </div>
        </div>
        <div className={`${expenses.length === 0 ? 'flex' : 'hidden'} rounded-2xl mx-5 mt-10 bg-teal-50 items-center justify-center p-4`}>
          <p className='text-teal-800 '>No Expanses added yet..</p>
        </div>

        {/*Deleted Expenses*/}

        <div className={`${deletedExpenses.length === 0?'hidden':'block'} lg:col-span-2 mt-18 space-y-4`}>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Trash2 size={18} className="text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Deleted Expenses</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">{deletedExpenses.length} activities</span>
          </div>
          <div className="space-y-3">
            {deletedExpenses?.map((expense) => (
              <div
                key={expense.id}
                className="bg-red-50/50 border border-red-200 hover:border-red-300 rounded-2xl p-4 flex items-center justify-between transition-all shadow-sm group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-red-50 border border-red-150 rounded-xl flex items-center justify-center text-red-300 group-hover:text-red-600 group-hover:bg-red-50 transition-colors">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                      {expense.description}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Removed By <span className="text-slate-700 font-medium">{expense.payer}</span> • {format(new Date(expense.date).toLocaleDateString(), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-slate-950">
                    {trip?.currency} {expense.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>}
    </div>
  );
}