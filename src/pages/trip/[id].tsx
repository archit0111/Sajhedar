import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ArrowLeft, Plus, DollarSign, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';

interface Trip {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  members: { name: string; email?: string }[];
  createdBy: string;
}

interface Expense {
  _id: string;
  tripId: string;
  payer: string;
  amount: number;
  description: string;
  date: string;
  splitType: 'equal' | 'custom' | 'percentage';
  splits: { memberId: string; amount: number }[];
}

export default function TripDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'settlement'>('overview');
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      description: '',
      amount: '',
      payer: '',
      date: '',
      splitType: 'equal',
      splits: [],
    },
  });

  const fetchTripData = async () => {
    try {
      const [tripResponse, expensesResponse] = await Promise.all([
        fetch(`/api/trips/${id}`),
        fetch(`/api/trips/${id}/expenses`)
      ]);

      if (tripResponse.ok) {
        const tripData = await tripResponse.json();
        setTrip(tripData);
      }

      if (expensesResponse.ok) {
        const expensesData = await expensesResponse.json();
        setExpenses(expensesData);
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (id && session) {
      fetchTripData();
    }
  }, [id, session]);

  const calculateSettlements = () => {
    if (!trip || !expenses) return [];

    const balances: { [key: string]: number } = {};
    
    // Initialize balances
    trip.members.forEach(member => {
      balances[member.name] = 0;
    });

    // Calculate balances
    expenses.forEach(expense => {
      const payer = trip.members.find(m => m.name === expense.payer);
      if (payer) {
        balances[payer.name] += expense.amount;
      }

      expense.splits.forEach(split => {
        const member = trip.members.find(m => m.name === split.memberId);
        if (member) {
          balances[member.name] -= split.amount;
        }
      });
    });

    return Object.entries(balances).map(([name, balance]) => ({
      name,
      balance,
    }));
  };

  const openExpenseModal = () => setExpenseModalOpen(true);
  const closeExpenseModal = () => {
    setExpenseModalOpen(false);
    reset();
  };

  const onExpenseSubmit = async (data: Record<string, unknown>) => {
    try {
      if (!trip) return;
      
      // Calculate equal split among all members
      const splitAmount = parseFloat(data.amount as string) / trip.members.length;
      const splits = trip.members.map((member: { name: string }) => ({
        memberId: member.name,
        amount: splitAmount,
      }));

      await fetch(`/api/trips/${id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount as string),
          tripId: id,
          splits,
        }),
      });
      closeExpenseModal();
      fetchTripData();
    } catch {
      alert('Failed to add expense');
    }
  };

  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
  }

  if (!trip) {
    return <div className="min-h-screen bg-gray-50 p-8">Trip not found</div>;
  }

  const settlements = calculateSettlements();
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{trip.name} | Trip Expense Manager</title>
      </Head>

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold">{trip.name}</h1>
            </div>
            <button
              onClick={openExpenseModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      <Dialog open={isExpenseModalOpen} onClose={closeExpenseModal} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 z-10">
            <Dialog.Title className="text-lg font-bold mb-4">Add Expense</Dialog.Title>
            <form onSubmit={handleSubmit(onExpenseSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input {...register('description', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.description && <p className="text-red-500 text-xs mt-1">Description is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" {...register('amount', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.amount && <p className="text-red-500 text-xs mt-1">Amount is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payer</label>
                <select {...register('payer', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select payer</option>
                  {trip.members.map((member, idx) => (
                    <option key={idx} value={member.name}>{member.name}</option>
                  ))}
                </select>
                {errors.payer && <p className="text-red-500 text-xs mt-1">Payer is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" {...register('date', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {errors.date && <p className="text-red-500 text-xs mt-1">Date is required</p>}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeExpenseModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Add</button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="font-medium">{trip.members.length} people</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="font-medium">{trip.currency} {totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'expenses', label: 'Expenses' },
                { id: 'settlement', label: 'Settlement' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'expenses' | 'settlement')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Trip Members Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Trip Members ({trip.members.length})
                  </h3>
                  {trip.members && trip.members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trip.members.map((member, index) => {
                        const memberExpenses = expenses.filter(exp => exp.payer === member.name);
                        const totalPaid = memberExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                        const memberSettlement = settlements.find(s => s.name === member.name);
                        
                        return (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{member.name}</p>
                                {member.email && <p className="text-sm text-gray-500">{member.email}</p>}
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Paid:</span>
                                <span className="font-medium">{trip.currency} {totalPaid.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Balance:</span>
                                <span className={`font-medium ${
                                  (memberSettlement?.balance || 0) > 0 ? 'text-green-600' : 
                                  (memberSettlement?.balance || 0) < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  {(memberSettlement?.balance || 0) > 0 ? '+' : ''}{trip.currency} {(memberSettlement?.balance || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No members found for this trip.</p>
                    </div>
                  )}
                </div>

                {/* Trip Statistics */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Trip Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Total Expenses</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{trip.currency} {totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Average per Person</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {trip.members.length > 0 ? `${trip.currency} ${(totalExpenses / trip.members.length).toFixed(2)}` : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Total Expenses</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {expenses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-xs">⚡</span>
                      </span>
                      Recent Activity
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="space-y-3">
                        {expenses.slice(0, 3).map((expense) => (
                          <div key={expense._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">
                                  {expense.payer.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">{expense.description}</p>
                                <p className="text-xs text-gray-500">Paid by {expense.payer}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">{trip.currency} {expense.amount.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">{format(new Date(expense.date), 'MMM dd')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'expenses' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Expenses</h3>
                {expenses.length === 0 ? (
                  <p className="text-gray-500">No expenses yet. Add your first expense!</p>
                ) : (
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <div key={expense._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-gray-500">
                              Paid by {expense.payer} on {format(new Date(expense.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <p className="font-semibold">{trip.currency} {expense.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settlement' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Settlement Summary</h3>
                <div className="space-y-4">
                  {settlements.map((settlement) => (
                    <div key={settlement.name} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{settlement.name}</span>
                        <span className={`font-semibold ${settlement.balance > 0 ? 'text-green-600' : settlement.balance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {settlement.balance > 0 ? '+' : ''}{trip.currency} {settlement.balance.toFixed(2)}
                        </span>
                      </div>
                      {settlement.balance > 0 && (
                        <p className="text-sm text-green-600 mt-1">Will receive money</p>
                      )}
                      {settlement.balance < 0 && (
                        <p className="text-sm text-red-600 mt-1">Owes money</p>
                      )}
                      {settlement.balance === 0 && (
                        <p className="text-sm text-gray-500 mt-1">All settled</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 