import { format } from 'date-fns';
import { Calendar, Users, DollarSign } from 'lucide-react';

interface TripCardProps {
  trip: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    currency: string;
    members: { name: string }[];
  };
  onClick: () => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{trip.name}</h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
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
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
} 