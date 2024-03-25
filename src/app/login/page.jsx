"use client"
import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import {ToastContainer ,toast,cssTransition,Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/navigation';
import {signIn,signOut} from 'next-auth/react'
import {useSession} from "next-auth/react";


const Login = () => {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loggedIn,setLoggedIn] = useState(false);
    const {data:session}= useSession();
    
    useEffect( ()=>{
        fetch("/api/logintest")
        .then((res) => res.json())
        .then((data)=>setLoggedIn(true));
    },[]);

    const handleSubmit= async (e) => {
        e.preventDefault();
        /*if (password === ''||email === ''){
            toast.error("Fill in all fields");
            return
        }
        if(password.length < 6 ){
            toast.error("Password must be more than 6");
            return
        }*/
        

        try{
            const res = await signIn('credentials', {email,password,redirect:false})
            if (res.ok){
                setLoggedIn(true)
                console.log('res',res)
                router.push("/dashboard")
                //toast.success("success")

              
            }else{
                toast.error("Error occurred again!")
            }
         }catch(error){

        }
    }
    return(
        <>
        <div className="flex flex-col w-full place-items-center">
            <div className="flex flex-col border p-4 border-blue-400 shadow-lg rounded-lg w-[50%] place-items-center">
                <h2 className="text-3xl font-semibold text-blue-400">Log In With Email and Pw</h2>
                <form action='/api/auth/callback/credentials' onSubmit={handleSubmit} className="flex flex-row flex-wrap gap-5 my-3">
                   
                    <input
                        className="p-2 border border-gray-300 rounded-md"
                        type="email"
                        placeholder='Email'
                        onChange={(e)=>setEmail(e.target.value)} />
                        <input
                        className="p-2 border border-gray-300 rounded-md"
                        type="password"
                        placeholder='Password'
                        onChange={(e)=>setPassword(e.target.value)} />
                        <div className="flex flex-col justify-end place-items-start w-full">
                        <button className="bg-blue-400 rounded-md p-3 text-white font-semibold justify-start self-start" type="submit">Log in</button>
                        <Link href="/register">Don&apos;t have an account?<br />Register now</Link>
                        </div>
                </form>
<<<<<<< HEAD
               
=======
                
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
            </div>
        </div>
        <ToastContainer />
        </>
    )
    
}

export default Login