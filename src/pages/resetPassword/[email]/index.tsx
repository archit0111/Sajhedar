import Nav from "@/components/Nav"
import { useState } from "react"
import { useRouter } from "next/router";

export default function ResetPassword(){
    const [status,setStatus]=useState(false);
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [error,setError]=useState('');
    const router = useRouter();
    const [loading,setLoading]=useState(false);

    const email = String(router.query.email);

    const handelResetPassword = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        if(password==='' || password.length<4){
            setError('Enter new password correctly of minimum 4 digits.');
            setLoading(false);
            return;
        }
        if(confirmPassword!==password || confirmPassword===''){
            setError('Confirm your password correctly..');
            setLoading(false);
            return;
        }
        try{
            const res = await fetch('/api/resetPassword',{
                method:'PATCH',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({password,email})
            });
            if(!res.ok){
                alert("Somthing went wrong!");
            }
            setStatus(true);
        }catch(e){
            alert(e);
        }finally{
            setLoading(false);
        }

    }


    return(
        <>
        <div className="m-4">
            <Nav/>
        </div>
        <div className="h-fit w-auto justify-center flex">
        {!status?<div className="h-fit p-12 mt-40 bg-teal-100 rounded-2xl items-center justify-center w-[55%] self-center">
                <h2 className="font-bold text-center text-xl">Enter Your New Password</h2>
                {error!==''?
                <div className="flex justify-center place-self-center mt-4 rounded-2xl p-4 bg-red-400 w-[50%]">{error}
                </div>:null}
                <input type="password"
                 required
                 placeholder="New Password"
                onChange={(e)=>setPassword(e.target.value)}
                className="border rounded-2xl p-1 px-4 text-center w-fit flex mt-5 place-self-center focus:border-blue-600"/>
                <input type="password"
                 required
                 placeholder="Confirm Password"
                onChange={(e)=>setConfirmPassword(e.target.value)}
                className="border rounded-2xl p-1 px-4 text-center w-fit flex mt-5 place-self-center focus:border-blue-600"/>
                <div className="mt-2 text-center text-sm font-extralight">
                    <button className="p-2 bg-teal-600 px-8 rounded-2xl text-white my-5 w-[85%] hover:bg-blue-600 focus:scale-95 cursor-pointer"
                    onClick={(e)=>handelResetPassword(e)}>{loading?"Please wait...":"Reset Password"}</button>
                </div>
            </div>:<div className="h-fit w-auto justify-center flex">
            <div className="h-fit p-4 mt-40 bg-teal-100 rounded-2xl items-center justify-center w-[55%] self-center">
                <h2 className="font-bold text-center text-xl">Password Reset Successfully🚀</h2>
                <div className="mt-5 text-center">
                    <p>Your password reset successfully, now you can login with your new password.</p>
                </div>
                <div className="mt-2 text-center text-sm font-extralight">
                    <button className="p-2 bg-teal-600 px-8 rounded-2xl text-white my-5 w-[85%] hover:bg-blue-600 focus:scale-95 cursor-pointer" onClick={()=>router.push('/login')}>Login</button>
                </div>
            </div>
        </div>}
        </div>
        </>
    )

}