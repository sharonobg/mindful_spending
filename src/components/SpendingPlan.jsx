import {headers} from "next/headers"

const getTotals = async () => {
    try{
<<<<<<< HEAD
        const res = await fetch("https://sharonobrien.com/api/transactiontitle-totals",{
=======
        //const res = await fetch("http://localhost:3000/api/transactiontitle-totals",{
        const res = await fetch("https://mindful-spending-22924.vercel.app/api/transactiontitle-totals",{
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch transactions");
        }
        return res.json();
    }catch(error){
        console.log("Error finding transactions",error)

    }
    
}
const getGrandTotals = async (props) => {
    try{
<<<<<<< HEAD
        const res = await fetch("https://sharonobrien.com/api/spending-totals-category",{
           cache: 'no-store',
=======
        //const res = await fetch("http://localhost:3000/api/spending-totals-category",{
            const res = await fetch("https://mindful-spending-22924.vercel.app/api/spending-totals-category",{
        cache: 'no-store',
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch transactions");
        }
        return res.json();
    }catch(error){
        console.log("Error finding transactions",error)
    }
}
// const getCategories = async () => {
//     try{
//         const res = await fetch("https://sharonobrien.com/api/category",{
//            cache: 'no-store',
//            method: "GET",
//            headers: headers(),
//         });
//         if(!res.ok){
//             throw new Error("Failed to fetch categories");
//         }
//         //console.log('route categories',{categories})
//         return res.json();
//     }catch(error){
//         console.log("Error finding categories",error)
//     }

// }
export default async function SPCategoryView(props) {
    //const {categories} = await getCategories();
    const transactiontotals = await getTotals();
    const grandtotals = await getGrandTotals();
    const getMonth = new Date().getMonth()+1
    const newD = new Date()
    const month = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    const getMonthYear = getMonth +'/' +getYear;
    //let propscategory = ''| undefined;
    //if(`${props.category}` == undefined){
    // propscategory = undefined
    //}else{
    // propscategory = `${props.category}`
    //}

    
   //console.log('SPCategoryView grandtotals',grandtotals)
    return(
       <>
      
       <div className="my-5 flex flex-col place-items-center">
       <h1>Monthly Spending Plan:  {props.fmonth}/{props.fyear}/{props.category}<br />(SpendingPlan)</h1>
       </div>
       <div className="my-5 flex flex-col place-items-center">
       <div className="flex flex-row  w-full min-h-[50%] bg-white">
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category Notes</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Planned Amount</div>
        <div className="font-bold border border-amber-500 w-[200px] py-2">Actual Amount</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </div>
        <div className="flex flex-row  w-full min-h-[50%] bg-white">
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category Notes</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">PlannedAmt</div>
        <div className="font-bold border border-amber-500 w-[200px] py-2">Actual Amt</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">not done</div>
        </div>
       
       {transactiontotals?.length > -1 ? (transactiontotals.map((transactiontotal,index) =>
        
        <div key={index} className="flex flex-row  w-full min-h-[50%] bg-white">
        
        { transactiontotal._id.year == `${props.fyear}` && transactiontotal._id.month == `${props.fmonth}` && (`${props.category}` == 'all-categories' ||  transactiontotal._id.title == `${props.category}`) && 
        <>
        <div className="border border-amber-500 w-[200px] p-2 ">{transactiontotal?._id.categoryId}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">{transactiontotal?._id.title}</div>
        
        <div className="border border-amber-500 w-[200px] p-2 ">Planned Amt</div>
        <div className="border border-amber-500 w-[200px] py-2">{transactiontotal?.amount?.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </>  }
        </div>
   
       )):("cant find any totals")
       
       }
       {grandtotals?.length > -1 ? (grandtotals.map((grandtotal,index) =>
        
        <div key={index} className="flex flex-row  w-full min-h-[50%] font-bold bg-white">
        {  grandtotal._id.year == `${props.fyear}` && grandtotal._id.month == `${props.fmonth}` && `${props.category}` == 'all-categories' &&
        <>
        <div className="border border-amber-500 w-[200px] p-2 ">{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">GrandTotal:{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">Plan Total</div>
        <div className="border border-amber-500 w-[200px] py-2">{grandtotal?.amount?.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </>}
        </div>
        
       )):("cant find any totals")
       
       }
       
        </div>
       </>
        
    )
}