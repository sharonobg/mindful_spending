import {headers} from "next/headers"

const getPlans = async (props) => {
    try{
        const res = await fetch("https://sharonobrien.com/api/spending-plan-alt",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch plan");
        }
        //const data = await res.json();
        //console.log('data',data);
        return res.json();
        //return data
    }catch(error){
        console.log("Error finding plan",error)

    }
    
}
const getTotals = async () => {
    try{
        const res = await fetch("https://sharonobrien.com/api/combo-waddfields-ttitles",{
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
const getCategories = async () => {
    try{
        const res = await fetch("https://sharonobrien.com/api/category",{
           cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch categories");
        }
        //console.log('route categories',{categories})
        return res.json();
    }catch(error){
        console.log("Error finding categories",error)
    }

}
export default async function SPCategoryView(props) {
    const transactiontotals = await getTotals();
    const getplans = await getPlans();
    const getMonth = new Date().getMonth()+1
    const newD = new Date()
    const month = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    const getMonthYear = getMonth +'/' +getYear;
  
    return(
       <>
          {/*<pre>SPW GET getplans:{JSON.stringify(getplans, null, 2)}</pre>*/}
          <pre>GET props:{JSON.stringify(props, null, 2)}</pre>
       <div className="my-5 flex flex-col place-items-center">
       <h1>NEW SPW Spending Plan Combo:  {props.fmonth}/{props.fyear}<br />(note-cats not entered should be 0.00 all categories should show)</h1>
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
        {getplans?.length > -1 ? (getplans.map((spending,index) =>
           
        <div key={index} className="spkey">
        { spending?.month == `${props?.fmonth}` && spending?.year == `${props?.fyear}` ?  (
                    <>
        <div className="flex flex-col" key={spending._id}>
                    
        {spending.mycategories.map((lookup,index) =>
           
            <div className="flex flex-row" key={index}>
            <div className="border border-amber-500 w-[200px] p-2 ">SPW:{spending.$amount}</div>
                     <div className="border border-amber-500 w-[200px] p-2 ">{spending.$title}</div>
            <div className="border border-amber-500 w-[200px] p-2 ">{spending.month}/{spending.year}</div>
            <div className="border border-amber-500 w-[400px] p-2 ">{lookup?.$mycategoryId}{lookup?.categorynotes}</div>
            
           
            <div className="border border-amber-500 w-[200px] p-2 ">{lookup?.planamount?.$numberDecimal}</div>
            
            </div>
            )
            }
            </div></> 
        ): `SPW You don't have a plan set up for ${props.fmonth}/${props.fyear}`}
        </div>
        
        )):("cant find plan")
        }
       {transactiontotals?.length > -1 ? (transactiontotals.map( (transactiontotal,index) =>
        <div key={index} className="transactiontotalkey">
        { transactiontotal._id.year == `${props.fyear}` && transactiontotal._id.month == `${props.fmonth}` && (`${props.category}` == 'all-categories' ||  transactiontotal._id.title == `${props.category}`) && 
        <>
        <div className="title border border-amber-500 w-[200px] p-2 ">TITLE:{transactiontotal?._id.title}</div>
        <div className="amount border border-amber-500 w-[200px] py-2">{transactiontotal?.amount.$numberDecimal}</div>
        <div className="diff border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="explain border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </>  }
        </div>
   
       )):("cant find any totals")
       
       }
       
        </div>
       </>
        
    )
}