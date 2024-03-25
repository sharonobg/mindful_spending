"use client"
import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import {HiPencilAlt} from "react-icons/hi";

const CategoryDetails = (ctx) => {
    const [categoryDetails,setCategoryDetails]=useState("");

    const{data: session}= useSession();
    const router = useRouter();

    useEffect(() => {
       const id = ctx.params.id
       async function fetchCategory(){                        
<<<<<<< HEAD
           const res = await fetch(`/api/category/${ctx.params.id}`,{cache:'no-store'})
           
=======
           //const res = await fetch(`http://localhost:3000/api/category/${ctx.params.id}`,{cache:'no-store'})
           const res = await fetch(`/api/category/${ctx.params.id}`,{cache:'no-store'})
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
           const category = await res.json()
           console.log('category after await: ',category)
           setCategoryDetails(category);
           console.log('category title: ',category?.title)
       }
      session && fetchCategory()
      
    },[session])
 const handleDelete = async (ctx) => {
    try{
        const confirmModal = confirm("Do you want to delete this category?");
        if(confirmModal){
<<<<<<< HEAD
=======
            //const res = await fetch(`http://localhost:3000/api/category/${ctx.params.id}`,{
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
            const res = await fetch(`/api/category/${ctx.params.id}`,{
            headers:{
                "Authorization": `Bearer ${session?.user?.accessToken}`
            },
            method:"DELETE"
        }) 
        if(res.ok){
            router.push("/")
        }
    }
        
    }catch(error){
        console.log('Error: ',error)
    }
  }
    return(
<div className="flex flex-col place-items-center">
        <div className="rounded-md w-[50%] p-3 place-items-center border border-blue-600 shadow-lg bg-yellow-100 min-h-[200px] text-black">
        <h3>Title: {categoryDetails?.title}</h3>
        
        <div className="controls">
                <div className="flex gap-2 flex-row ">
                    <div className="flex flex-row">
                        <Link className="flex flex-row gap-1" href={`/add-category/edit/${ctx.params.id}`}>Edit<BsFillPencilFill /></Link>
                    </div>
                    <button onClick={handleDelete} className="flex flex-row gap-1" >Delete<AiFillDelete /></button>
                </div>
            </div>
        
        
        </div>
</div>
    )
}
export default CategoryDetails