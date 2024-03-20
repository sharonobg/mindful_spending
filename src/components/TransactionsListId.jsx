import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import {headers} from "next/headers"
import RemoveTransaction from "../components/RemoveTransaction";

  
export default async function TransactionList(props) {
    
 
 
const getTransactions = async () => {
        try{
            
            //const res = await fetch("http://localhost:3000/api/transaction",{
                
            const res = await fetch("https://mindful-spending-22924.vercel.app/api/transaction",{
                cache: 'no-store',
                method: "GET",
                headers: headers(),
            });
            if(!res.ok){
                throw new Error("Failed to fetch transactions");
            }
            //console.log('res in route: ',res)
            //console.log('transadctionsListId props ln 23',props) 
            return res.json();
        }catch(error){
            console.log("Error finding transactions",error)
        }
    }

const {transactions} = await getTransactions();
const newsearchParams = new URLSearchParams(props);
//console.log('comp newsearchParams',newsearchParams)
//console.log('comp transactionslistid',transactions)

    return(
       <>
       <div className="mt-5 flex flex-col place-items-center">
       <h1>My Transactions: {props.fmonth}/{props.fyear}</h1>
       <div className="mt-5 bg-white  flex flex-row h-auto p-0 my-0 border border-collapse border-blue-600"> 
            <div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Month/Day/Year</div> <div className="font-bold border-collapse border border-amber-500 w-[250px] p-2 flex-wrap">Category</div>
            <div className="font-bold border-collapse border border-amber-500 w-[250px] p-2 flex-wrap">Description</div>
            <div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Type of Account</div>
            <div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">Category</div>
            <div className="font-bold border-collapse border border-amber-500 w-[150px] py-2">Amount</div>
            <div className= "font-bold w-[100px] py-2 flex flex-row justify-center gap-3">Edit/Delete</div>
        </div>
        {transactions?.length > -1 ? (transactions.map( (transaction) => 
          
        <div key={transaction._id} className="flex flex-col bg-white">
        
            <div className="my2 flex flex-row h-auto p-0  my-0"> 
            
            { transaction.year == `${props.fyear}` && transaction.month == `${props.fmonth}` && transaction.month == `${props.fmonth}` && 
            (`${props.category}` === 'all-categories' ||  transaction.title == `${props.category}`) && 
            
                
                    <>
                <div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">{transaction.month}/{transaction.day}/{transaction.year}</div>
                <div className="border-collapse border border-amber-500 w-[200px] p-2">{transaction?.categoryId}</div>
                <div className="border-collapse border border-amber-500 w-[250px] p-2 flex-wrap">{transaction.descr}</div>
                <div className="border-collapse border border-amber-500 w-[200px] p-2">{transaction.acctype}</div>
                <div className="border-collapse border border-amber-500 w-[200px] p-2">{transaction?.title}</div>
                <div className="border-collapse border border-amber-500 w-[150px] py-2">{transaction?.amount.$numberDecimal}</div>
                <div className= "border-collapse border border-amber-500 w-[100px] py-2 flex flex-row justify-center gap-3">
                <Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                <RemoveTransaction className="flex flex-row gap-1 justify-center" id={transaction._id} />
                </div>
                </>
            
            
        }
       
    
            </div>
        </div>
        
    
       )): "no transactions are available"}
       
       </div>
       </>
        
    )
}