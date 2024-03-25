import {headers} from "next/headers"

const comboPlans = async (props) => {
    try{
        const res = await fetch("https://sharonobrien.com/api/combo217",{
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
const getGrandTotals = async (props) => {
    try{
        const res = await fetch("https://sharonobrien.com/api/spending-totals-category",{
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
    //const transactiontotals = await getTotals();
    //const spendingplannew = await getPlans();
    //const  getboth = await  getBothWTotals();
    //const spendingplannotalt = await getPlansFirst(); 
    const grandtotals = await getGrandTotals();
    const comboplans = await comboPlans();
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
//const mycategoriesdata = getPlans();

    //console.log('comboPlans',comboplans)
    //console.log('spending planfiltermonth',props.fmonth)
    //console.log('spending planfilteryear',props.fyear)
   //console.log('SPCategoryView transactiontotals',transactiontotals)
   //console.log(` 2/17 COMBO DATES: ${comboplans?.month}/${ comboplans?.year}`)
    return(
       <>
       <h1>COMBO PLANS 21324</h1>
        {/*<pre>GET comboplans:{JSON.stringify(comboplans, null, 2)}</pre>*/}
        <pre>GET props:{JSON.stringify(props, null, 2)}</pre>
       <div className="my-5 flex flex-col place-items-center">
       <h1>Combo:  {props.fmonth}/{props.fyear}/ showing: {props.category}<br />(Combo plans 217)</h1>
       </div>
       <div className="my-5 flex flex-col place-items-center">
       <div className="flex flex-row  w-full min-h-[50%] bg-white">
       
       <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category Title</div>
       <div className="font-bold border border-amber-500 w-[300px] p-2 ">Category Id</div>
       <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category Notes</div>
       <div className="font-bold border border-amber-500 w-[150px] p-2 ">Planned Amount</div>
       
       <div className="font-bold border border-amber-500 w-[150px] py-2">Actual Amount</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Explain Diff</div>
        </div>
        {comboplans?.length > -1 ? (comboplans.map((comboplan,index) =>
           
            
        <div key={index} className="spkey flex flex-row">
        { comboplan._id.month == `${props?.fmonth}` && comboplan._id.year == `${props?.fyear}` && 
                    <>
        {comboplan._id?.mycategories?.$mycategoryId==comboplan._id.categoryId  && (`${props.category}` == 'all-categories' ||  comboplan._id?.titleLower == `${props.category}`) && 
                        <>
            <div className="border border-amber-500 w-[200px] p-2 ">{comboplan._id?.categoryTitle}</div>
            <div className="border border-amber-500 w-[300px] p-2 ">{comboplan._id?.mycategories?.$mycategoryId}</div>
            <div className="border border-amber-500 w-[200px] p-2 ">{comboplan._id?.mycategories?.categorynotes}</div>
            <div className="border border-amber-500 w-[150px] p-2 ">{comboplan._id?.mycategories?.planamount?.$numberDecimal}</div>
            
            <div className="border border-amber-500 w-[150px] p-2 ">{comboplan?.amount?.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 ">{comboplan?.difference?.$numberDecimal}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">{ comboplan._id.month}/ { comboplan._id.year}</div>
        </>
        }
        </>}
        </div>
        )):"nothing here" }
       {grandtotals?.length > -1 ? (grandtotals.map((grandtotal,index) =>
        <div key={index} className="flex flex-row  w-full min-h-[50%] font-bold bg-white">
        {  grandtotal._id.year == `${props.fyear}` && grandtotal._id.month == `${props.fmonth}` && `${props.category}` == 'all-categories' &&
        <>
        <div className="border border-amber-500 w-[200px] p-2 ">{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">GrandTotal:{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 ">Plan Total</div>
        <div className="border border-amber-500 w-[150px] py-2">{grandtotal?.amount.$numberDecimal}</div>
        <div className="border border-amber-500 w-[150px] py-2">{grandtotal?.amount.$numberDecimal}</div>
        <div className="border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="border border-amber-500 w-[200px] p-2 "> explain</div>
        </>}
        </div>
        
       )):("cant find any totals")
       
       }
       
        </div>
       </>
        
    )
}