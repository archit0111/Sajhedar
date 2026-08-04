import Link from "next/link";
import { useState } from "react";

export default function Nav(){

  const [list,setList]=useState(false);

  return(
    <>
    <div className="justify-between items-center flex p-5 bg-teal-600 rounded-2xl">
      <div className="text-2xl items-center flex font-bold">
        <div className="font-extrabold flex items-center place-self-center w-full text-white bg-amber-600 rounded-full m-1 text-2xl h-8 p-2.5">S</div>
        Sajhedar
      </div>   
      <div className="md:flex hidden justify-end gap-[10%] w-[40%]">
        <Link href={'/'} className="font-semibold hover:text-amber-700">Home</Link>
        <Link href={'/trips'} className="font-semibold hover:text-amber-700">Trips</Link>
        <Link href={'/feedback'} className="font-semibold hover:text-amber-700">Feedback</Link>
        <Link href={'/account'} className="font-semibold hover:text-amber-700">Account</Link>
      </div>
      <div className="md:hidden font-bold text-3xl hover:cursor-pointer"
      onClick={()=>setList(prev=>!prev)}>
        {list?'x':'≡'}
      </div>
    </div>
    <div className={`${list?'grid':'hidden'} grid-cols-1 absolute right-8 top-26 text-center p-4 bg-teal-100/70 rounded-lg`}>
      <Link href={'/'} className="text-lg font-semibold border-b-1 hover:text-amber-700">Home</Link>
      <Link href={'/trips'} className="text-lg font-semibold border-b-1 hover:text-amber-700">Trips</Link>
      <Link href={'/feedback'} className="text-lg font-semibold border-b-1 hover:text-amber-700">Feedback</Link>
      <Link href={'/account'} className="text-lg font-semibold hover:text-amber-700">Account</Link>
    </div>
    </>
  )
}