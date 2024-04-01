"use client"

import React,{useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession} from 'next-auth/react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateTransaction = () => {
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState("")
    const [acctype,setAcctype]= useState("")
    const [categories,setCategories]=useState([])
    const [categoryId,setCategoryId]= useState("")
    const [amount,setAmount]= useState("")
    const {data:session,status} = useSession();
    const router= useRouter();


    useEffect(() => {
    
        fetch('/api/category')
          .then((res) => res.json())
          .then(({categories}) => {
            setCategories(categories)
            //setLoading(false)
          })
      }, [])
    if(status === 'loading'){
        return <p>Loading...</p>
    }
    if(status === 'unauthenticated'){
        return <p className="font-bold text-red-500 text-center">Access Denied - Please Sign In</p>
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!transdate || !descr ||!acctype  ||!amount){
            toast.error("Please fill in all the fields")
            return
        }
        try{
            //const transdate = new Date().toISOString();
            //console.log('transdate react-datepicker: ',transdate)
            //const amount = parseFloat(amount).toFixed(2);
            const res = await fetch('/api/transaction',{
                headers:{
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${session?.user?.accessToken}`
                },
                method:'POST',
                body:JSON.stringify({
                    transdate:new Date(transdate),
                    descr,
                    //categoryTitle,
                    acctype,
                    amount:parseFloat(amount).toFixed(2),
                    authorId:session?.user?._id,
                    categoryId
                    //categoryId:ObjectId(categoryId)
                })
            })

            if(!res.ok){
                throw new Error("Error on auth")
            }
            const transaction = await res.json();
            //console.log('transaction ln65',transaction)
            //router.refresh()
            //router.push(`/transaction/${transaction?._id}`)
             router.push(`/dashboard}`)
        }catch (error) {

        }
    }
    
    return(
        <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Create Transaction</h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
            <select onChange={(e) => setCategoryId(e.target.value)}>
                    {categories?.length > -1 ? 
                    (categories.slice(1).map((category) =>
                        <option key={category._id} value={category._id}>{category._id}:{category.title}</option>
                    
                   ) ): "no categories are available"}</select>
                <DatePicker classname="border border-blue-600" selected={transdate} onChange={(date) => setTransdate(date)} />
                <input onChange={(e) => setDescr(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="description"
                placeholder="Description"
                type="text"
                />
                <select type="text" value ={acctype} onChange={(e) => setAcctype(e.target.value)}>
                <option value="debit">Debit</option>
                <option value="cash">Cash</option>
                <option value="bank_account">Bank Account</option>
                <option value="other">Other</option>
                </select>
                
                <input onChange={(e) => setAmount(e.target.value)}
                name="amount"
                placeholder="0.00"
                type="string"
                />
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Create Transaction</button>
            </form>
        </div>
        <ToastContainer />
        </>)
}
export default CreateTransaction