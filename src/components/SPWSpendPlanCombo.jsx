//import {headers} from "next/headers"
import Spendingplan from "../models/spendingplanModel";
import Transaction from "../models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../app/api/auth/[...nextauth]/route"

export default async function SPCategoryView(props) {
    //const transactiontotals = await getTotals();
    //const getplans = await getPlans();
    const getMonth = new Date().getMonth()+1
    const newD = new Date()
    //const month = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    //const getMonthYear = getMonth +'/' +getYear;
  
    //const yeardate = params
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        //const sessionUser = session?.user?._id;
        //console.log('yeardate',yeardate)
        const spendingplanloc = await Spendingplan.aggregate([
          {

            "$match": { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } }
           },
           
           {
            $project: {
              authorId: 1,
              planyear: {
                $year: "$planmonthyear",
              },
              planmonth: {
                $month: "$planmonthyear",
              },
              mycategories: 1,
            },
          },
          {
            $addFields: {
              mycategories_details: {
                $arrayElemAt: ["$mycategories", 0],
              },
            },
          },
          {
            $unwind: {
              path: "$mycategories",
            },
          },
          {
            $lookup: {
              from: "categories",
              let: {
                // mycategoryA: {
                //   $toObjectId:
                //     "$mycategories.mycategoryId",
                // },
                mycategoryId: {
                  $toObjectId:
                    "$mycategories.mycategoryId",
                },
                planamountA: "$mycategories.planamount",
              },
              pipeline: [
                {
                  $addFields: {
                    title: "$title",
                    category: "$_id",
                  },
                },
                {
                  $project: {
                    mycategoryId: "$$mycategoryId",
                    planamount: "$$planamountA",
                    title: "$title",
                    category: "$category",
                    planmonthyear: 1,
                    //mycategories:1
                  },
                },
                {
                  $match: {
                    $expr: {
                      $eq: ["$category", "$mycategoryId"],
                    },
                  },
                },
              ],
              as: "mycategories",
            },
          },
          {
            $unwind: "$mycategories",
          },
          {
            $project: {
              planyear: 1,
              planmonth: 1,
              mycategories: 1,
            },
          },
           
          
          ])
        const transactionstotalspw = await Spendingplan.aggregate([
            { $match: {
                //"categoryId": { $exists: true, },
                 $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
            }
          },
          {
            $project: {
              authorId: 1,
              planyear: {
                $year: "$planmonthyear",
              },
              planmonth: {
                $month: "$planmonthyear",
              },
              mycategories: 1,
            },
          },
          {
            $project: {
              //_id: {
                //_id: "$_id",
                planyear: "$planyear",
                planmonth: "$planmonth",
                cattotal: {
                  $sum: "$mycategories.planamount",
                },
              //},
            },
          },
            ])

      //console.log("spendingplanloc: ",spendingplanloc)
      
    return(
      <>
          {/*<pre>SPW GET transactionstotalspw:{JSON.stringify(transactionstotalspw, null, 2)}</pre>
          <pre>GET props:{JSON.stringify(props, null, 2)}</pre>*/}
       <div className="my-5 flex flex-col place-items-center">
       <h1>Monthly Spending Plan:  {props.fmonth}/{props.fyear}<br /></h1>
       </div>
      <div className="my-5 flex flex-col place-items-center">
       <div className="flex flex-row  w-full min-h-[50%] bg-white">
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category Notes</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category</div>
        <div className="font-bold border border-amber-500 w-[200px] p-2 ">Planned Amount</div>
        </div>
        {spendingplanloc?.length > -1 ? (spendingplanloc.map((spending,index) =>
           
        <div key={index} className="spkey">
        { spending?.planmonth == `${props?.fmonth}` && spending?.planyear == `${props?.fyear}` ?  (
                    <>
        <div className="flex flex-row" key={index}>
            <div className="border border-amber-500 w-[200px] p-2 ">{spending.mycategories?.categorynotes}</div>
            <div className="border border-amber-500 w-[200px] p-2 ">{spending.mycategories?.title}</div>
            {/*<div className="border border-amber-500 w-[200px] p-2 ">{spending.planmonth}/{spending.planyear}</div>*/}
            <div className="border border-amber-500 w-[200px] p-2 ">{parseFloat(spending.mycategories.planamount).toFixed(2)}</div>
            {/*<div className="border border-amber-500 w-[200px] p-2">{spending.mycategories?._id}</div>*/}
            
        </div>
            </> 
        ): ""}
        </div>
        )):("cant find plan")
        }
        {transactionstotalspw?.length > -1? (transactionstotalspw.map((sptotal,index) =>
        <div  key="index" className="flex flex-row place-items-center font-bold w-full justify-between border border-amber-500 py-2">
        {/*<div className="transactiontotalkey">ID:{sptotal._id}</div>*/}
        <div className="w-[400px]">{sptotal?.planmonth}/{sptotal.planyear} SPENDING PLAN TOTAL: </div>
        <div className="w-[200px]">{parseFloat(sptotal?.cattotal).toFixed(2)}</div>
        </div>
        )):"nototal"}
    </div>
   </>) 
}