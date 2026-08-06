import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface StatusState {
  type?: "success" | "error" | "";
  message?: string;
}

export default function Signup(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [status,setStatus]=useState<StatusState>({});
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(false);
  const router = useRouter();



 const signInWithGoogle= async ()=>{
  try{
    //Trigger google OAuth
    await signIn("google");
  }catch(e){
    setStatus({
      type:"error",
      message: e instanceof Error ? e.message : "Faild to sign in wiht google"
    })
  }
 }

  const handleSignUp = async (e:React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: '', message: '' });
    
    // Basic Client Validation
    if (!name.trim() || !email.trim() || !password) {
      setError(true);
      setStatus({ type: 'error', message: 'All fields are required.' })
      setLoading(false)
      return
    }
    if(password.length<6){
      return setStatus({type:'error',message:"Password must be of 6 characters"})
    }
    setLoading(true);
    
    try{
      alert(name+email+password)
      const res = await fetch('api/auth/signup',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,email,password})
      })
      const data=await res.json();
      if(!res.ok){
        if(res.status===422){
          setStatus({type:'error',message:data.message+" Login please..."});
          router.push('/login')
        }
        throw new Error(data.message||"Failed to create account");
      }

      setStatus({
        type:"success",
        message:"Account created! Redirecting to login..."
      })

    }catch(e){
      setStatus({
        type:"error",
        message:e instanceof Error ?e.message : "Something went wrong. Please try again."
      })
    }finally{
      setLoading(false);
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
    <div className="flex h-screen items-center justify-center">
      <div className="p-4 m-4 w-[80%] sm:w-[50%] lg:w-[30%] shadow-lg rounded-2xl bg-teal-50">
        <h3 className="font-bold text-teal-800 text-2xl text-center my-2 pb-5">Signup</h3>
        <div className={error===true?"bg-red-300 rounded-xl h-fit py-4 w-[80%] justify-self-center text-center font-light mb-2":"hidden"}>{<p className="text-sm">{status.message}</p>}</div>
        <form onSubmit={(e)=>handleSignUp(e)} className="p-2 w-full space-y-2">
          <div className="pb-4 flex flex-col">
            <div>
              <label htmlFor="name" className="font-medium text-teal-800">Name</label>
            </div>
            <input type="text"
            placeholder="Enter your name"
            className="p-1 px-1 border rounded-sm mt-1"
            onChange={(e)=>setName(e.target.value)}/>
          </div>
          <div className="pb-4 flex flex-col">
            <div>
              <label htmlFor="email"className="font-medium text-teal-800">Email</label>
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
            placeholder="Create your password"
            className="p-1 px-1 border rounded-sm mt-1"
            onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <div className="text-center">
            <button type="submit" className="bg-green-400 hover:bg-green-500 rounded-sm p-1 py-2 w-[40%] mt-8 mb-4 focus:scale-95 transition-all sm:text-lg font-semibold text-white">{loading?"Please wait..":"SignUp"}</button>
            <p className="font-extralight text-sm">Already have account?<span onClick={()=>router.push('/login')} className="hover:text-sm hover:cursor-pointer font-semibold text-blue-500">Login</span></p>
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