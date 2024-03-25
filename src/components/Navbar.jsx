"use client"

import Link from 'next/link';
import {signIn,signOut,useSession} from 'next-auth/react';
import React,{useState} from 'react';

export default function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false);
    //const [loggedIn, setLoggedIn] = useState(false);
    // const handleShowDropdown = () => setShowDropdown(prev => true)
    // const handleHideDropdown = () => setShowDropdown(prev => false)
    const {data: session} = useSession()
    //const loggedIn = false;

    return(
        <nav className="flex flex-row align-middle max-w-[100%] px-8 py-3 bg-blue-400 justify-between">
            <Link className="text-white font-bold" href = {"/"}>Home</Link>
            
            <div className="flex flex-row justify-around gap-5">
            {session?.user
            ?(
                <><Link className="text-white font-bold" href = {"/transaction"}>Add a transaction</Link>
            <Link className="text-white font-bold" href = {"/my-spending-plan"}target="_blank">Spending Plan</Link>
            <div className="text-white font-bold">`Logged in with ${session.user?.email}`</div>
                <button onClick={() => signOut()} className="text-white font-bold">Sign Out</button>
                <button onClick={(e) =>  {e.preventDefault(); signIn()}} className="text-white font-bold">Sign In</button>
                <Link className="text-white font-bold ml-4" href="/register">Register</Link>
                </>):(<>
                {/*<button onClick={(e) =>  {e.preventDefault(); signIn()}} className="text-white font-bold">Sign In</button>
                <Link className="text-white font-bold ml-4" href="/register">Register</Link>*/}
                </>
                )}
                </div>
            
        </nav>
    )
}