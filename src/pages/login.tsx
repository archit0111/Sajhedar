import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState(false);
  const [status,setStatus]=useState({type:'',message:''});
  const router = useRouter();

  const signInWithGoogle= async ()=>{
    try{
      //Trigger google OAuth
      await signIn("google");
    }catch(e:any){
      setStatus({
        type:"error",
        message:e.message || "Faild to sign in wiht google"
      })
    }
   }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    if (!email || !password) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    try {
      // Use NextAuth signIn with 'credentials' provider
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setStatus({
          type: "error",
          message: res.error || "Invalid credentials.",
        });
      } else {
        setStatus({
          type: "success",
          message: "Login successful! Redirecting...",
        });

        // Redirect to dashboard or homepage
        router.push("/dashboard");
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "An unexpected error occurred. Please try again.",
      });
    } 
  }

  return(
    <div className="bg-slate-50 pt-10">
    <div className="flex justify-between pt-3 lg:mx-5 mx-4 bg-teal-600 items-center p-2 pl-4 rounded-2xl">
      <div className="text-2xl items-center flex font-bold">
        <div className="font-extrabold flex items-center place-self-center w-full text-white bg-amber-600 rounded-full m-1 text-2xl h-8 p-2.5">S</div>
        Sajhedar
      </div>   
    </div>
{/* 
    <div className="h-20 w-20 bg-slate-900"></div>
    <div className="h-20 w-20 bg-emerald-600"></div>
    <div className="h-20 w-20 bg-emerald-200"></div>
    <div className="h-20 w-20 bg-slate-50"></div>
    <div className="h-20 w-20 bg-teal-600"></div>
    <div className="h-20 w-20 bg-amber-500"></div>
    <div className="h-20 w-20 bg-gray-900"></div>
    <div className="h-20 w-20 bg-neutral-50"></div> */}
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 m-4 w-[80%] sm:w-[50%] lg:w-[30%] shadow-lg rounded-2xl bg-teal-50">
        <h3 className="font-bold text-2xl text-teal-800 text-center my-2 pb-5">Login</h3>
        <div className={error===true?"bg-red-300 rounded-xl h-fit py-4 w-[80%] justify-self-center text-center font-light mb-2":"hidden"}>{<p className="text-sm">{error}</p>}</div>
        <form onSubmit={(e)=>handleSubmit(e)} className="p-2 w-full">
          <div className="pb-4 flex flex-col">
            <div>
              <label htmlFor="email" className="font-medium text-teal-800">Email</label>
            </div>
            <input type="email"
            placeholder="Enter your email"
            className="p-1 px-1 border rounded-sm mt-1"
            onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className="pb-4 flex flex-col">
            <div>
              <label htmlFor="passeord" className="font-medium text-teal-800">Password</label>
            </div>
            <input type="password"
            placeholder="Enter your password"
            className="p-1 px-1 border rounded-sm mt-1"
            onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <div className="text-center">
            <button type="submit" className="bg-green-400 hover:bg-green-500 rounded-sm p-1 w-[40%] mt-8 mb-4 focus:scale-95 transition-all">Login</button>
            <p className="font-extralight text-sm">New User? <span onClick={()=>router.push('/signup')} className="hover:text-sm hover:cursor-pointer font-semibold text-blue-500">Signup</span></p>
          </div>
        </form>
        <div className="mt-4 mb-2 text-center">
          <button
            onClick={signInWithGoogle}
            className="w-full flex justify-center justify-self-center gap-2 sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-base sm:text-lg font-semibold"
            >
            <img src="Google__G__logo.svg.png" className="h-5 self-center" alt="google_logo" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}