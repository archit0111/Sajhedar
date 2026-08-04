import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { useRouter } from "next/router";

export default function Home(){

  const router = useRouter();

  return(
    <>
    <div className="h-fit bg-slate-50">
    <div className="px-10 md:px-15 py-5">
      <Nav/>
    </div>
    <div className="h-auto w-full text-center mt-4 py-20">
      <h1 className="sm:text-4xl text-teal-800 text-3xl font-bold">Welcome to Trip Expance Manager</h1>
      <p className="text-teal-600/80 mt-2 sm:text-lg">Split your trip expances easily with us</p>
    </div>
    <div className="justify-center flex">
      <img src="heroSectionPic.png" alt="hero_sec_pic" />
    </div>
    <div className="mb-4">
      <div className="flex justify-center">
        <div className="rounded-2xl bg-amber-500 p-1 w-[20%] font-bold text-white"></div>
      </div>
    </div>
    <div className="mt-12">
      <div className="flex justify-center pt-4">
        <button onClick={()=>router.push('/signup')} className="rounded-2xl bg-green-500 p-4 font-bold text-white hover:bg-green-600">Get Started</button>
      </div>
    </div>
    <div className="m-4 mt-15 h-fit p-4">
      <p className="font-bold text-teal-800 text-2xl">Our Features</p>
      <div className="m-4 grid-cols-2 gap-x-[10%] gap-y-[20%] py-4 grid">
        <div className="flex justify-center  py-4 bg-teal-100/65 m-2 rounded-2xl ">
          <p className="font-bold md:text-4xl text-2xl text-teal-600 flex justify-center items-center text-center py-4">Easy split your trip expances.</p>
        </div>
        <div className="flex justify-center  py-4 bg-teal-100/65 m-2 rounded-2xl ">
          <p className="font-bold md:text-4xl text-2xl text-teal-600 flex justify-center items-center text-center py-4">Bank-grade security.</p>
        </div>
        <div className="flex justify-center  py-4 bg-teal-100/65 m-2 rounded-2xl ">
          <p className="font-bold md:text-4xl text-2xl text-teal-600 flex justify-center items-center text-center py-4">Settle in one tap.</p>
        </div>
        <div className="flex justify-center  py-4 bg-teal-100/65 m-2 rounded-2xl ">
          <p className="font-bold md:text-4xl text-2xl text-teal-600 flex justify-center items-center text-center py-4">Group trips, cleanly organized.</p>
        </div>
      </div>
    </div>
    <div className="mt-25">
      <Footer/>
    </div>
    </div>
    
    </>
  )
}