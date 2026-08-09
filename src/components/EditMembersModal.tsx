// import { ITrip } from "@/models/Trip";
// import { useState } from "react";

// interface EditMembersModalProps {
//     isOpen:boolean,
//     onClose:()=>void
//     trip:ITrip | undefined
// }

// export default function EditMembersModal ({isOpen, onClose, trip}:EditMembersModalProps){
//     const [value,setValue]=useState('');

//     const members = [{}];

    
//   const addMember = () => {
//     setValue('add');
//   };

//   const removeMember = (index: number) => {
//     if (members.length > 1) {
//       setValue('remove');
//     }
//   };
//   if(!isOpen){
//     onClose();
//     return;
//   }

//     return(
//         <>
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//         <div className="bg-teal-50 rounded-2xl h-fit w-[90%] sm:w-[60%] lg:w-[45%] p-6 border border-teal-800">
//             <div>
//             <div className="flex justify-between items-center mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Trip Members
//               </label>
//               <button
//                 type="button"
//                 onClick={addMember}
//                 className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
//               >
//                 {/* <Plus className="w-4 h-4" /> */}
//                 Add Member
//               </button>
//             </div>

//             <div className="space-y-3">
//               {members.map((_, index) => (
//                 <div key={index} className="flex gap-3">
//                   <div className="flex-1">
//                     <input
//                     //   {...register(`members.${index}.name`)}
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Member name"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <input
//                     //   {...register(`members.${index}.email`)}
//                       type="email"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Email (optional)"
//                     />
//                   </div>
//                   {members.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeMember(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       {/* <Trash2 className="w-5 h-5" /> */}
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//             {/* {errors.members && (
//               <p className="text-red-500 text-sm mt-1">{errors.members.message}</p>
//             )} */}
//           </div>
//         </div>
//         </div>
//         </>
//     )
// }