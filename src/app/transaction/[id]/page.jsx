"use client"

import React, {useState,useEffect} from 'react'
import {useSession}from 'next-auth/react';
import {useRouter} from 'next/navigation'
//import Link from "next/link"
//import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import {ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RemoveTransaction from '../../../components/RemoveTransaction'


    
const Edit = (ctx) => {
    //let newdate = new Date().toISOString//();
    //console.log('newdate',newdate)
    const [transactionDetails,setTransactionDetails]=useState("");
    const [transdate,setTransdate]= useState(new Date())
    const [descr,setDescr]= useState("")
    const [acctype,setAcctype]= useState("")
    const [categories,setCategories]=useState([])
    const [categoryTitle,setCategoryTitle]= useState("")
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
  }, []);

useEffect(() => {
    
   async function fetchTransaction() {  
                         
       const res = await fetch(`/api/transaction/${ctx.params.id}`
       ,{cache:'no-store'}
       )
       const transaction = await res.json()
       //console.log('fetchTransaction',transaction)
       const transdatePrev = transaction.transdate;
       const dataamount=transaction.amount.$numberDecimal;
       setTransactionDetails({
            transdate:transdatePrev,
            acctype:transaction.acctype,
            descr:transaction.descr,
            categoryId:transaction.categoryId,
            amount:dataamount,
            //authorId:session?.user._id
        })}
    fetchTransaction()
},[])
//console.log('transactionDetails after set: ',transactionDetails)
if(status === 'loading'){
    return <p>Loading...</p>
}
if(status === 'unauthenticated'){
    
    return <p className="font-bold text-red-500">AccessDenied</p>
}

const handleSubmit= async (e) => {
    e.preventDefault();
    try{
        //const id = ctx.params.id;
        const body = {
            transdate,
            descr,
            acctype,
            categoryId,
            amount
        }
        const res = await fetch(`/api/transaction/${ctx.params.id}`,{
    
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "PUT",
        //body: JSON.stringify(body)
        body:JSON.stringify(body)
        
    })
    //console.log('res after edit:',res)
    if(res.ok){
        console.log("Edit went through")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }

    const transaction = await res.json();
    //console.log('transaction edit: ',transaction);
    router.push("/dashboard");
    }catch(error){
        console.log(error)
    }

    
}
const handleDeleteA= async (e) => {
    e.preventDefault();
    try{
        const id = ctx.params.id;
        //const body = {
        //    transdate,descr,acctype,categoryId,amount
        //}
        const res = await fetch(`/api/transaction/${ctx.params.id}`,{
    
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${session?.user?.accessToken}`
        },
        method: "DELETE",
        //body: JSON.stringify(body)
        //body:JSON.stringify(body)
        
    })
    //console.log('res after edit:',res)
    if(res.ok){
        toast.success("Delete went through")
        console.log("Delete went through")
    }else{
        toast.error("Edit failed")
        console.log("Edit failed")
    }

    //const transaction = await res.json();
    //console.log('transaction edit: ',transaction);
    router.push("/dashboard");
    }catch(error){
        console.log(error)
    }

    
}
// const handleDelete = async (ctx) => {
//     const id = ctx.params.id
//     console.log(id)
//         const confirmed = confirm("Are you sure?");
//         if(confirmed){
//             //ctx.params.id
            
//             const res = await fetch(`/api/transaction/${ctx.params.id}`, {
//                 method: "DELETE"
//             });
//             if(res.ok){
//                 router.refresh();
//             }
            
//         }
//     }

return(
    <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            <h2>Edit Transaction</h2>
            <pre>Mytestplan:{JSON.stringify(transactionDetails, null, 2)}</pre>
            <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
             <DatePicker 
             value={transactionDetails.transdate}
             onChange={(date) => setTransdate(date)}
             classname="border border-blue-600" 
               />
               <h2>{new Date(transdate).toString()}</h2>
                <input onChange={(e) => setDescr(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="description"
                placeholder="Description"
                type="text"
                defaultValue={transactionDetails.descr}
                />
               
               <h2>{descr}</h2>
                <select 
                onChange={(e) => setAcctype(e.target.value)}
                type="text" 
                value ={transactionDetails.acctype} 
                >
                <option value="debit">Debit</option>
                <option value="cash">Cash</option>
                <option value="bank_account">Bank Account</option>
                <option value="other">Other</option>
                </select>
                <h2>{acctype}</h2>
                <select onChange={(e) => setCategoryId(e.target.value)}
                className="px-4 py-2 mt-4 mx-5 border border-green-200 text-green-500"
                name="categoryTitle"
                placeholder="Category"
                type="text"
                value={transactionDetails.categoryId}
                >
                    {categories?.length > -1 ? 
                    (categories.map((category) => 
                    <>
                    
                        <option key={category._id} id={category._id} value={category._id}>{category.title} : {category._id}</option>

                        
                        </>
                   ) ): "no categories are available"}</select>
                
                <input onChange={(e) => setAmount(e.target.value)}
                name="amount"
                placeholder="0.00"
                type="string"
                defaultValue={transactionDetails.amount}
                />
                <h2>{amount}</h2>
                <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Edit Transaction</button>
            </form>
            <div className="flex gap-2 flex-row ">
                    {/*<div className="flex flex-row">
                        <Link className="flex flex-row gap-1" href={`/transaction/edit/${ctx.params.id}`}>Edit<BsFillPencilFill /></Link>
                    </div>*/}
                   <RemoveTransaction id="" />
                    <button onClick={handleDeleteA} className="flex flex-row gap-1" >Delete<AiFillDelete /></button>
                </div>
            
        </div>
        <ToastContainer />
    </>
)
}
export default Edit
