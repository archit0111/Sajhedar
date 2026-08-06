import { FormEvent, useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { ITrip } from "@/models/Trip";

interface AddExpanseModalProps {
    id:string | null;
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded?: () => void;
}

export default function AddExpanseModal ({id, isOpen, onClose, onExpenseAdded}:AddExpanseModalProps){
    const {data:session,status}=useSession();
    const [selectedOption,setSelectedOption]=useState<string>('equal');
    const [trip,setTrip]= useState<ITrip | null>(null);
    const [amount,setAmount]=useState<number  | null>(null);
    const [description,setDescription]=useState<string>('');
    const [paidBy,setPaidBy]=useState('');

    useEffect(()=>{
        const fetchTrip = async ()=>{
            if(!id) return;
            try{
                const res= await fetch(`/api/trips/${id}`);
                const trip = await res.json();
                if(!res.ok){
                    throw new Error("Error in fetching trip!");
                }
                setTrip(trip);
                setPaidBy(trip.members.find((m:any)=> m.email === session?.user?.email || m.name === session?.user?.name))
            }catch(e){
                console.error("Failed to fetch trip", e);
            }
        }
        if (isOpen) {
      fetchTrip(); 
    }
    },[id,isOpen,status]);

    const handelAddExpanse = async(e:FormEvent)=>{
        e.preventDefault();
        try{
            const memberCount  = trip?.members?.length || 0;
            let splits= null;
            if(memberCount===0){
                alert('Number of members are not be 0!');
                return;
            }
                
            if(selectedOption ==='equal'){
                const splitAmount = parseFloat((Number(amount)/memberCount).toFixed(2));
                splits = trip?.members.map((member)=>({
                    memberId:member._id,
                    amount:splitAmount
                }));
            }else if (selectedOption==="custom"){
                //
            }

            const body={
                    tripId:id,
                    description:description,
                    amount:amount,
                    splitType:selectedOption,
                    splits:splits,
                    payer:paidBy._id,
                    date: Date.now()
                }
            
            const res  = await fetch(`/api/trips/${id}/expenses`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(body)
            })
            if(!res.ok){
                console.log("Backend Error Response:", res);
                console.log(res);
            }
            onExpenseAdded?.();
            onClose();
        }catch(e){
            console.error("Error in adding expanse:, ",e);
        }

    }

    if(!isOpen) return null;

   
    return(
        <>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 ">
        <div className="bg-teal-50 rounded-2xl h-fit w-[55%] p-4 border border-teal-800">
                <div className="text-teal-800 text-center text-lg font-bold">Add New Expanse</div>
            <div className="mt-5">
                <form className="space-y-5" onSubmit={(e)=>handelAddExpanse(e)} >
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                    </label>
                    <input 
                    type="number"
                    onChange={(e)=>{setAmount(Number(e.target.value))}}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Enter expanse amount ex: 1200" />
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <input type="text"
                    onChange={(e)=>setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ex: Hotel booking.."/>
                    <label htmlFor="splitType" className="block text-sm font-medium text-gray-700 mb-2">
                        SplitType
                    </label>
                    <select
                    id='splitType'
                    onChange={(e) => setSelectedOption(e.target.value as 'equal' | 'custom' | 'percentage')}
                    className="border w-full px-3 py-2 border-gray-300 rounded-medium text-gray-700"
                    >
                        <option value="equal">Equal</option>
                        <option value="custom">Custom</option>
                        <option value="percentage">Percentage</option>
                    </select>
                    <div className={`${selectedOption !== 'equal'?'block':"hidden"}`}>
                        <div className="block text-sm font-medium text-gray-700 mb-2">
                        Amount Paid by
                    </div>
                    {trip?.members?.map((member)=>(
                        <div key={member._id?.toString()} className="pl-4 items-center py-1">
                            <p className="font-semibold">{member.name}</p>
                        </div>
                    ))}
                    <div className="flex justify-between gap-2 w-full"></div>
                    <div className="flex justify-between gap-2 w-full"></div>
                    </div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                        Payer : {session?.user?.name}
                        {/* <select name="paidBy" id="paidBy" 
                        className="border border-teal-800 rounded px-2 py-2"
                        onChange={(e)=>setPaidBy(e.target.value)}>
                            {trip?.members.map((member)=>(
                                <option value={String(member._id)}>{member.name}</option>
                            ))}
                        </select> */}
                    </div>
                    <div className="justify-between flex gap-4">
                        <button
                        onClick={onClose}
                        className="cursor-pointer bg-teal-50 hover:border-red-500 border border-teal-600 rounded-lg py-2 px-3 w-[50%] mt-5">Cancel</button>
                        <button
                        type="submit"
                        className="bg-green-500 cursor-pointer hover:bg-green-600 focus:scale-95 rounded-lg py-2 px-3 w-[50%] mt-5">Add Expanse</button>
                    </div>
                    Not working yet..
                </form>
            </div>
        </div>
        </div>
        </>
    )
}