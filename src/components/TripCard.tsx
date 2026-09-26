import { format } from 'date-fns';
import { Calendar, Users, DollarSign, Banknote } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface TripCardProps {
  trip: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    currency: string;
    createdBy:string;
    members: { name: string }[];
  };
}

export default function TripCard({trip}:TripCardProps) {

  const [createdBy,setCreatedBy]=useState('');

const router = useRouter();
useEffect(()=>{
  const fetchCreator = async ()=>{
    try{
    const res = await fetch(`/api/users/${trip.createdBy}`);
    const user = await res.json();

    if (res.ok){
      setCreatedBy(user.name);
    }
  }catch(e){
    console.error('Failed to fetch user:',e);
  }
  }
fetchCreator();
},[trip.createdBy])

  return (
    <div 
      className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5"
    >
      <div className="flex items-start justify-between gap-4 px-2 py-1">
          <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
            {trip.name}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60 shrink-0">
            <Banknote className="h-3.5 w-3.5" />
            {trip.currency.toUpperCase()}
          </span>
        </div>
      
      <div className="space-y-2 text-sm text-gray-600 px-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(trip.startDate), 'MMM dd')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{trip.members.length} members</span>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>Currency: {trip.currency}</span>
        </div>
      </div>

      <div className="flex items-center text-sm/relaxed gap-2 mt-2">
          <p>Created by:</p>
          <span>{createdBy.toUpperCase()}</span>
        </div>
      
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
        onClick={()=>router.push(`/trip/${trip._id}`)}
        className="w-full bg-teal-800 text-white cursor-pointer py-2 px-4 rounded-md hover:bg-teal-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
} 