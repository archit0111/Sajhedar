import { format } from 'date-fns';
import { Calendar, Users, DollarSign } from 'lucide-react';
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
      className="bg-teal-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl pl-2 font-semibold mb-3 text-gray-800">{trip.name}</h3>
      
      <div className="space-y-2 text-sm text-gray-600">
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
        className="w-full bg-teal-800 text-white cursor-pointer py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
} 