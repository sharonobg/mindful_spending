"use client"

import React, {useState,useEffect} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
import {ToastContainer ,toast} from 'react-toastify';

const Edit = (ctx) => {
    const [title,setTitle] = useState("");
    const {data:session,status} = useSession();
    const router = useRouter();

useEffect(() => {
    async function fetchCategory(){
        const id = ctx.params.id;
        const res = await fetch(`/api/category/${id}`);
        const category = await res.json();
        setTitle(category.title);
    }
    fetchCategory()
},[])
if(status === 'loading'){
    return <p>Loading...</p>
}
if(status === 'unauthenticated'){
    
    return <p className="font-bold text-red-500">AccessDenied</p>
}
const handleSubmit= async (e) => {
    e.preventDefault();
    
    if(!title){
        toast.error("Please fill in all the fields")
        return
    }
    try{
        const id = ctx.params.id;
        const body = {title}
        const res = await fetch(`/api/category/${id}`,{
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "PUT",
        body:JSON.stringify(body)
        
    })
    //console.log('res after edit:',res)
    if(res.ok){
        //console.log("Edit went through")
    }else{
        console.log("Edit failed")
    }

    const category = await res.json();
    //console.log(category);
    router.push("/dashboard");
    }catch(error){
        console.log(error)
    }

    
}

return(
    <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Edit Category</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                    className=""
                    name="category-title"
                    placeholder="Category Title"
                    type="text"
                />
                
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Edit Category</button>
            </form>
            
        </div>
        <ToastContainer />
    </>
)
}
export default Edit
