import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Plus } from 'lucide-react';
import TripCard from '@/components/TripCard';
import CreateTripModal from '@/components/CreateTripModal';

interface Trip {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  members: { name: string }[];
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchTrips();
    }
  }, [session]);

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTrip = async (tripData: any) => {
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        const newTrip = await response.json();
        setTrips([newTrip, ...trips]);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  };

  const handleTripClick = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head>
        <title>Dashboard | Trip Expense Manager</title>
      </Head>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
        <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">Sign Out</button>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Trip
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading trips...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-4">No trips yet</p>
          <p>Create your first trip to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onClick={() => handleTripClick(trip._id)}
            />
          ))}
        </div>
      )}

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTrip}
      />
    </div>
  );
} 