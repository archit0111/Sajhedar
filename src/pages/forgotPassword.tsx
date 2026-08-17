import Nav from "@/components/Nav"
import { useState } from "react"
import { useRouter } from "next/router";

export default function ForgotPassword(){
    const [email,setEmail]=useState('');
    const [error,setError]=useState('');
    const [emailSent,setEmailSent]=useState(false);
    const router = useRouter();
    const [loading,setLoading]=useState(false);

    const handelSentResetEmail = async (e:React.FormEvent)=>{
        e.preventDefault();
        if(email===''){
            setError('Enter your registered email..');
        }
        try{
            // const fetchUser = await fetch('/api/user');
        }catch(e){
            alert(e);
        }

    }


    return(
        <>
        <div className="m-4">
            <Nav/>
        </div>
        <div className="h-fit w-auto justify-center flex">
            {!emailSent?
            <div className="h-fit p-4 mt-40 bg-teal-100 rounded-2xl items-center justify-center w-[55%] self-center">
                <h2 className="font-bold text-center text-xl">Enter Your Registered Email</h2>
                {error!==''?
                <div className="flex justify-center place-self-center mt-4 rounded-2xl p-4 bg-red-400 w-[50%]">{error}
                </div>:null}
                <input type="email"
                 required
                 placeholder="example.gmail.com"
                className="border rounded-2xl p-1 px-2 text-center w-fit flex mt-5 place-self-center focus:border-blue-600"/>
                <div className="mt-2 text-center text-sm font-extralight">
                    <button className="p-2 bg-teal-600 px-8 rounded-2xl text-white my-5 w-[85%] hover:bg-blue-600 focus:scale-95 cursor-pointer"
                    onClick={(e)=>handelSentResetEmail(e)}>Send Reset Link</button>
                    <p>New User? <span className="font-bold text-teal-800 hover:text-blue-700 focus:scale-95"
                    onClick={()=>router.push('/signup')}>SignUp</span></p>
                </div>
            </div>:<div className="h-fit p-4 mt-40 bg-teal-100 rounded-2xl items-center justify-center w-[55%] self-center">
                <h2 className="font-bold text-center text-xl">Reset Link Sent Successfully🚀</h2>
                <div className="mt-5 text-center">
                    <p>Password reset link is send to your registered email id {email.substring(0,2)}*******gmail.com</p>
                </div>
                <div className="mt-5 text-center">
                    <p>Please click on link to reset your password</p>
                </div>
                <div className="mt-2 text-center text-sm font-extralight">
                    <button className="p-2 bg-teal-600 px-8 rounded-2xl text-white my-5 w-[85%] hover:bg-blue-600 focus:scale-95 cursor-pointer">Login</button>
                    <p>Reset link not recived? <span className="font-bold text-teal-800 hover:text-blue-700 focus:scale-95">Resend</span></p>
                </div>
            </div>}
        </div>
        </>
    )

}