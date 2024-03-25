"use client"

import React,{useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession}from 'next-auth/react';

const CreateCategory = () => {

    const {data:session,status} = useSession();
    const router= useRouter();
    const [title,setTitle]= useState("")
    if(status === 'loading'){
        return <p>Loading...</p>
    }
    if(status === 'unauthenticated'){
       return <p className="font-bold text-red-500">Access Denied</p>
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title){
            toast.error("Please add title with more than 6 characters!")
            return
        }
        try{
<<<<<<< HEAD
=======
            //const res = await fetch('http://localhost:3000/api/category',{
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
            const res = await fetch('/api/category',{
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${session?.user?.accessToken}`
                },
                method:'POST',
                body:JSON.stringify({title})
            })
            if(!res.ok){
                throw new Error("Error on auth")
            }
            const category = await res.json();
            router.push(`/add-category/${category?._id}`)
        }catch (error) {
            throw new Error("Failed to add a category")
        }
    }
    return(
        <>
        
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Create Category</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
                <input onChange={(e) => setTitle(e.target.value)}
                    className=""
                    name="category-title"
                    placeholder="Category Title"
                    type="text"
                />
                
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Category</button>
            </form>
        </div>
        <ToastContainer />
        </>)
}
export default CreateCategory