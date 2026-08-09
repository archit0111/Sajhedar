import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { ITrip } from '@/models/Trip';

interface Member {
  _id?: string | unknown;
  name?: string | null;
  email?: string | null;
  [key: string]: unknown;
}

interface AddExpanseModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded?: () => void;
}

export default function AddExpanseModal({ id, isOpen, onClose, onExpenseAdded }: AddExpanseModalProps) {
  const { data: session, status } = useSession();
  const [selectedOption, setSelectedOption] = useState<'equal' | 'custom' | 'percentage'>('equal');
  const [trip, setTrip] = useState<ITrip | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [paidBy, setPaidBy] = useState<String>(session?.user?.name ?? '');

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/trips/${id}`);
        const tripData = await res.json();
        if (!res.ok) {
          throw new Error("Error in fetching trip!");
        }
        setTrip(tripData);
      } catch (e) {
        console.error("Failed to fetch trip", e);
      }
    };

    if (isOpen) {
      fetchTrip();
    }
  }, [id, isOpen, session, status]);

  const handelAddExpanse = async (e: FormEvent) => {
    e.preventDefault();
    const selectedPayer = paidBy || session?.user?.name;

    if (selectedPayer==='') {
      alert("Please select a valid payer.");
      return;
    }
    try {
      const memberCount = trip?.members?.length || 0;
      let splits = null;

      if (memberCount === 0) {
        alert('Number of members cannot be 0!');
        return;
      }

      if (selectedOption === 'equal') {
        const splitAmount = parseFloat((Number(amount) / memberCount).toFixed(2));
        splits = trip?.members?.map((member: Member) => ({
          memberId: member._id ? String(member._id) : '',
          amount: splitAmount,
        }));
      } else if (selectedOption === "custom") {
        // Custom split implementation
      }

      const body = {
        tripId: id,
        description: description,
        amount: amount,
        splitType: selectedOption,
        splits: splits,
        payer: paidBy===''?session?.user?.name:paidBy,
        date: Date.now(),
      };

      const res = await fetch(`/api/trips/${id}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.log("Backend Error Response:", res);
      }

      onExpenseAdded?.();
      onClose();
    } catch (e) {
      console.error("Error in adding expense: ", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-teal-50 rounded-2xl h-fit w-[90%] sm:w-[60%] lg:w-[45%] p-6 border border-teal-800">
        <div className="text-teal-800 text-center text-lg font-bold">Add New Expense</div>
        <div className="mt-5">
          <form className="space-y-4" onSubmit={handelAddExpanse}>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter expense amount ex: 1200"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                id="description"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Ex: Hotel booking.."
              />
            </div>

            <div>
              <label htmlFor="splitType" className="block text-sm font-medium text-gray-700 mb-1">
                Split Type
              </label>
              <select
                id="splitType"
                onChange={(e) => setSelectedOption(e.target.value as 'equal' | 'custom' | 'percentage')}
                className="border w-full px-3 py-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="equal">Equal</option>
                <option value="custom">Custom</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div className="block text-sm font-medium text-gray-700 mt-2">
              <label htmlFor="payer" className="block text-sm font-medium text-gray-700 mb-1">
                Payer
              </label>
              <select id="payer"
              required
              onChange={(e)=>setPaidBy(e.target.value)}>
                {trip?.members?.map((m)=>(
                  <option key={String(m._id || m.name)} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="justify-between flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer bg-teal-50 hover:bg-gray-100 border border-teal-600 rounded-lg py-2 px-3 w-[50%]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white cursor-pointer hover:bg-green-600 focus:scale-95 rounded-lg py-2 px-3 w-[50%]"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}