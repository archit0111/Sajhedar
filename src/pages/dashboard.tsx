import React, { useEffect, useState } from 'react';
import {
  Plus
} from 'lucide-react';
import Nav from '@/components/Nav';
import TripCard from '@/components/TripCard';
import CreateTripModal from '@/components/CreateTripModal';
import { useSession } from 'next-auth/react';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { ITrip } from '@/models/Trip';


interface Member {
  name?: string | null;
  email?: string | null;
  [key: string]: unknown;
}

export default function Dashboard() {

  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [router, status]);

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!session) return;

      try {
        const res = await fetch('/api/trips');

        if (!res.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await res.json();
        setTrips(data);
        
      } catch (e) {
        console.log(e);
      }
    }
    fetchUserTrips();
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-xl font-bold text-teal-800">Loading your dashboard...</p>
      </div>
    )
  }

  if (!session) {
    return null;
  }

  const onClose = () => {
    setIsOpen(false);
  }

  const onSubmit = async (data:Member) => {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to create trip');
      console.log("Trip created successfully!");
      const newTrip = resData.trip || resData;
      setTrips((prevTrips):any => [newTrip, ...prevTrips]);
    } catch (e) {
      console.error('Error in creating trip:', e);
    }
  }
  return (
    <div className='bg-slate-50'>
      <div className='m-5 bg-slate-50'>
        <Nav />
      </div>
      <div className="m-5 mt-25 grow">
        <div className='justify-center flex'>
          <p className='font-bold text-center text-teal-800 text-3xl md:text-4xl'>
            Welcome, {session.user?.name}! Start your Trip today with us
          </p>
        </div>
        <div className='flex justify-center mt-15'>
          <button className='p-4 font-bold text-slate-50 rounded-2xl cursor-pointer flex bg-teal-400 hover:bg-green-500'
            onClick={() => setIsOpen(prev => !prev)}>
            <Plus className='text-white pr-1' /> Start New Trip
          </button>
        </div>
        <div className="mt-20">
          <h3 className='pl-2 font-bold text-2xl text-teal-800'>Your Trips</h3>
        </div>
        {trips.length === 0 ? (
          <div className="h-40 m-2 mb-80 flex items-center justify-center bg-teal-50 mt-10 rounded-2xl font-medium text-teal-800">
            No trips present...
          </div>
        ) : (
          <div className="grid mb-80 grid-cols-1 md:grid-cols-2 place-content-center gap-6 m-2 mt-10">
            {trips.map((trip: ITrip) => (
              <TripCard key={String(trip._id)} trip={trip as unknown as React.ComponentProps<typeof TripCard>["trip"]}/>
            ))}
          </div>
        )}

      </div>
      <Footer />
      <CreateTripModal isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}