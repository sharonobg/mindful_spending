import Link from "next/link"
import { BsFillPencilFill } from 'react-icons/bs'
import {headers} from "next/headers"
import RemoveTransaction from "../components/RemoveTransaction";
//import {getTransactions} from "../utils/transactions";
import {NextResponse} from "next/server";
import Transaction from "../models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions} from "../app/api/auth/[...nextauth]/route"
  
//const thisMonth = new Date().getMonth()+1;//this is default
//const thisYear = new Date().getFullYear()
const thisMonth = 3
const thisYear = 2024
const thisCat = 'all-categories'
// export async function getTransactions() {
//     try{
//       await connect();
//       //const yeardate = params
//       const session = await getServerSession(authOptions);
//       const sessionUser = session?.user?._id;
//       //console.log('yeardate',yeardate)
//       const transactions = await Transaction.aggregate([
//         { $match: {
//             $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
//         }},
//          {
//             "$lookup": {
//               "from": "categories",
//               "let": {
//                 categoryId: {
//                  "$toObjectId": "$categoryId"
//                 }
//               },
//               "pipeline": [
//                 {
//                   $match: {
//                     $expr: {
//                       $eq: [
//                         "$_id",
//                         "$$categoryId",
//                       ]
//                     }
//                   }
//                 },
//                 {
//                   $project: {
//                     _id:0,
//                     day : {$dayOfMonth : "$transdate"},
//                     month : {$month : "$transdate"}, 
//                     year : {$year :  "$transdate"},
//                     "transdate":1,
//                    "descr":1,
//                    categoryId:"$categoryId",
//                    title: { $toLower : '$title' },
//                     //title: 1,//category title,
//                     amount:1
                    
//                   }
//                 }
//               ],
//               "as": "category"
//             }
//           },
//           {
//             "$unwind": "$category"
//           },
//           { 
//               $addFields: {
//                 month_date: {"$month": new Date() } 
//                 }
//             },
//           {
//             $project: {
//               "transdate":1,
//               "descr":1,
//               "acctype":1,
//               day : {$dayOfMonth : "$transdate"},
//               month : {$month : "$transdate"}, 
//               year : {$year :  "$transdate"},
//               categoryId:"$categoryId",
//               title: { $toLower : "$category.title" },
//               "amount":1,
//               month_date:1
//             }
            
//           },
//       {
//         "$sort": {
//           //"year": -1,
//           //"month":1
//           "transdate":1
//         }
//     }
        
//     ])
//     console.log('transactions from route',transactions)
//     return NextResponse.json(
//       {transactions},
//       {message: "Transactions list works"},
//       {status: 201}
//   )
//   }catch(error){
//       return new Response(JSON.stringify(null), {status:500})
//   }
//   }
export default async function TransactionList() {
// const getTransactions = async () => {
//         try{
    
//             //const res = await fetch("http://localhost:3000/api/transaction",{
                
//             const res = await fetch("https://sharonobrien.com/api/transaction",{
//                 cache: 'no-store',
//                 method: "GET",
//                 headers: headers(),
//             });
//             if(!res.ok){
//                 throw new Error("Failed to fetch transactions");
//             }
//             //console.log('res in route: ',res)
//             //console.log('transadctionsListId props ln 23',props) 
//             return res.json();
//         }catch(error){
//             console.log("Error finding transactions",error)
//         }
//     }

//const transactions = await getTransactions();
//const yeardate = params
      const session = await getServerSession(authOptions);
      const sessionUser = session?.user?._id;
      //console.log('yeardate',yeardate)
      const transactions = await Transaction.aggregate([
        { $match: {
            $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
        }},
         {
            "$lookup": {
              "from": "categories",
              "let": {
                categoryId: {
                 "$toObjectId": "$categoryId"
                }
              },
              "pipeline": [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        "$$categoryId",
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id:0,
                    day : {$dayOfMonth : "$transdate"},
                    month : {$month : "$transdate"}, 
                    year : {$year :  "$transdate"},
                    "transdate":1,
                   "descr":1,
                   categoryId:"$categoryId",
                   title: { $toLower : '$title' },
                    //title: 1,//category title,
                    amount:1
                    
                  }
                }
              ],
              "as": "category"
            }
          },
          {
            "$unwind": "$category"
          },
          { 
              $addFields: {
                month_date: {"$month": new Date() } 
                }
            },
          {
            $project: {
              "transdate":1,
              "descr":1,
              "acctype":1,
              day : {$dayOfMonth : "$transdate"},
              month : {$month : "$transdate"}, 
              year : {$year :  "$transdate"},
              categoryId:"$categoryId",
              title: { $toLower : "$category.title" },
              "amount":1,
              month_date:1
            }
            
          },
      {
        "$sort": {
          //"year": -1,
          //"month":1
          "transdate":1
        }
    }
        
    ])
//const newsearchParams = new URLSearchParams(props);
//console.log('comp newsearchParams',newsearchParams)
//console.log('comp transactionslistid',transactions)

    return(
       <>
       <div className="mt-5 flex flex-col place-items-center">
       <h1>My Transactions: thisMonth / thisYear</h1>
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
            
            { transaction.year == thisYear && transaction.month == thisMonth && transaction.month == thisMonth && 
            
                
                    <>
                <div className="font-bold border-collapse border border-amber-500 w-[200px] p-2">{transaction.month}/{transaction.day}/{transaction.year}</div>
                <div className="border-collapse border border-amber-500 w-[200px] p-2">{transaction?.categoryId}</div>
                <div className="border-collapse border border-amber-500 w-[250px] p-2 flex-wrap">{transaction.descr}</div>
                <div className="border-collapse border border-amber-500 w-[200px] p-2">{transaction.acctype}</div>
                <div className="border-collapse border border-amber-500 w-[200px] p-2">{transaction?.title}</div>
                <div className="border-collapse border border-amber-500 w-[150px] py-2">{transaction?.amount.$numberDecimal}</div>
                <div className= "border-collapse border border-amber-500 w-[100px] py-2 flex flex-row justify-center gap-3">
                <Link className="flex flex-row gap-1 justify-center" href={`/transaction/${transaction?._id}`}><BsFillPencilFill /></Link>
                {/*<RemoveTransaction className="flex flex-row gap-1 justify-center" id={transaction._id} />*/}
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