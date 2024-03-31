import {headers} from "next/headers"
import Transaction from "../models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions} from "../app/api/auth/[...nextauth]/route"
//import {Spendingplan} from "../models/spendingplanModel";

export default async function CategoryView(props) {

    const session = await getServerSession(authOptions);
    const sessionUser = session?.user?._id;

    const grandtotals = await Transaction.aggregate([
        { $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
        { $match: {
            "categoryId": { $exists: true, },
             $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
        }},
         //WORKS
         {
            "$lookup": {
              "from": "categories",
              "let": {
                categoryId: {
                  //"$toObjectId": "$categoryId"
                  "$toObjectId": "$categoryId"
                }
              },
              "pipeline": [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        "$$categoryId"
                      ]
                    }
                  }
                },
                {
                  $project: {
                    transdate:1,
                    descr: 1,
                    title: { $toLower : "$category.title" },
                  
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
              _id: 0,
              month : {$month : "$transdate"}, 
              year : {$year :  "$transdate"},
              //title: "$title",
              title: { $toLower : "$category.title" },
              descr: 1,
              amount:{$sum: "$amount"},
              month_date:1
              
            }
          },
          //{ $match: {
          //  //"$month": "January" //,
          //   $expr : { $eq: [ "$month" , "$month_date" ] } 
          //  }
          //},
        {
            "$group" : {
                _id:
                
                {
                    month: "$month",
                    year: "$year",
                }
                ,"amount": {$sum: "$amount"}}
              //this groups by 
            //"$group" : {_id: "$categoryId","amount": {$sum: "$amount"}}//this groups by descr
        },
        {
            "$sort": {
              "year": -1,
              "month":-1
              //"name": 1
            }
        }
      ])
    const comboplans = await Transaction.aggregate([
            //{ $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
            { $match: {
                //"categoryId": { $exists: true, },
                 $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
            }},
            {
              $lookup: {
                from: "categories",
                let: {
                  categoryId: {
                    $toObjectId: "$categoryId",
                  },
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$categoryId"],
                      },
                    },
                  },
                  {
                    $addFields: {
                      titleLower: {
                        $toLower: "$title",
                      },
                    },
                  },
                  {
                    $project: {
                      categoryId: 1,
                      title: 1,
                      titleLower: "$titleLower",
                    },
                  },
                ],
                as: "category",
              },
            },
            {
              $lookup: {
                from: "spendingplans",
                let: {
                  authorId: "$authorId",
                  month: {
                    $month: "$transdate",
                  },
                  year: {
                    $year: "$transdate",
                  },
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$authorId", "$$authorId"],
                      },
                    },
                  },
                  {
                    $addFields: {
                      planmonth: {
                        $month: "$planmonthyear",
                      },
                      planyear: {
                        $year: "$planmonthyear",
                      },
                    },
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$planmonth", "$$month"],
                          },
                          {
                            $eq: ["$planyear", "$$year"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      date: {
                        mycategories: "$mycategories",
                        month: "$$month",
                        year: "$$year",
                        planmonth: "$planmonth",
                        planyear: "$planyear",
                        categoryId: "$categoryId",
                        categoryTitle: "$title",
                        titleLower: "$titleLower",
                      },
                    },
                  },
                  {
                    $replaceRoot: {
                      newRoot: "$date",
                    },
                  },
                ],
                as: "mycategories",
              },
            },
            {
              $unwind: {
                path: "$mycategories",
              },
            },
            {
              $project: {
                categoryId: "$categoryId",
                month: {
                  $month: "$transdate",
                },
                year: {
                  $year: "$transdate",
                },
                title: "$category.title",
                titleLower: "$category.titleLower",
                //titleLower:{$toLower:"$category.title"},
                mycategories: "$mycategories.mycategories",
                planmonth: "$planmonth",
                planyear: "$planyear",
                //mycategory: "$mycategories.mycategoryId",
                amount: {
                  $sum: "$amount",
                },
              },
            },
            {
              $unwind: {
                path: "$mycategories",
              },
            },
            {
              $group: {
                _id: {
                  year: "$year",
                  month: "$month",
                  planmonth: "$planmonth",
                  planyear: "$planyear",
                  categoryTitle: "$title",
                  titleLower: "$titleLower",
                  mycategories: "$mycategories",
                  categoryId: "$categoryId",
                },
                amount: {
                  $sum: "$amount",
                },
              },
            },
            {
              $project: {
                amount: "$amount",
                planamount: "$myplanamt",
                difference: {
                  $subtract: [
                    "$_id.mycategories.planamount",
                    "$amount",
                  ],
                },
              },
            },
            {
              $sort: {
                year: -1,
                month: -1,
              },
            },
          ])
          //const grandtotals = await getGrandTotals();
          //const comboplans = await comboPlans();
          const getMonth = new Date().getMonth()+1
          const newD = new Date()
          const month = newD.toLocaleString('default', { month: 'long' });
          const getYear = new Date().getFullYear()
          const getMonthYear = getMonth +'/' +getYear;
    return(
       <>
       {/*<pre>GET comboplans:{JSON.stringify(comboplans, null, 2)}</pre>
        <pre>TotalCombo:{JSON.stringify(transactionstotalcombo, null, 2)}</pre>
        <pre>GET props:{JSON.stringify(props, null, 2)}</pre>*/}
       <div className="my-5 flex flex-col place-items-center">
       <h1>Planned and Actual Spending Running Totals for: {props.fmonth}/{props.fyear}.<br /> Showing: {props.category}</h1>
       </div>
       <div className="my-5 flex flex-col place-items-center">
       <div className="flex flex-row  w-full min-h-[50%] bg-white">
       
       <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category</div>
       {/*<div className="font-bold border border-amber-500 w-[300px] p-2 ">Category Id</div>*/}
       <div className="font-bold border border-amber-500 w-[200px] p-2 ">Category Notes</div>
       <div className="font-bold border border-amber-500 w-[150px] p-2 ">Planned Amount</div>
       
       <div className="font-bold border border-amber-500 w-[150px] py-2">Actual Amount</div>
        <div className="font-bold border border-amber-500 w-[100px] p-2 ">Difference</div>
        <div className="font-bold border border-amber-500 w-[300px] p-2 ">Explain Diff</div>
        </div>
        {comboplans?.length > -1 ? (comboplans.map((comboplan,index) =>
        
        <div key={index} className="spkey flex flex-row">
    {/*<div>INFO:{comboplan._id.month}=={`${props?.fmonth}`} {comboplan._id.year}=={`${props?.fyear}`}</div>
    <div>INFO:{comboplan._id.mycategories.mycategoryId}=={comboplan._id.categoryId} {comboplan._id.year}=={`${props?.fyear}`}</div>*/}
        {comboplan._id?.mycategories.mycategoryId?.toString() == comboplan._id?.categoryId?.toString()  &&
         comboplan._id.month == `${props?.fmonth}` && comboplan._id.year == `${props?.fyear}` &&
                    <>
        {/*{comboplan._id?.mycategories?.mycategoryId == comboplan._id.categoryId  &&*/}
                        <>
            <div className="border border-amber-500 w-[200px] p-2 ">{comboplan._id.categoryTitle}</div>
            {/*(<div className="border border-amber-500 w-[300px] p-2 ">{comboplan._id?.mycategories?.mycategoryId}</div>
            <div className="border border-amber-500 w-[300px] p-2 ">Cat:{comboplan._id.categoryId}</div>*/}
            <div className="border border-amber-500 w-[200px] p-2 ">NOTES{comboplan._id?.mycategories?.categorynotes}</div>
            <div className="border border-amber-500 w-[150px] p-2 ">{parseFloat(comboplan._id?.mycategories?.planamount).toFixed(2)}</div>
            
            <div className="border border-amber-500 w-[150px] p-2 ">{parseFloat(comboplan?.amount).toFixed(2)}</div>
        <div className="border border-amber-500 w-[100px] p-2 ">{parseFloat(comboplan?.difference).toFixed(2)}</div>
        {/*<div className="border border-amber-500 w-[200px] p-2 ">{ comboplan._id.month}/ { comboplan._id.year}</div>*/}
        <div className="border border-amber-500 w-[300px] p-2 ">Explain:{comboplan._id?.mycategories?.explain}</div>
        </>
        {/*}*/}
        </>}
        </div>
        
        )):"nothing here" }
       {grandtotals?.length > -1 ? (grandtotals.map((grandtotal,index) =>
        <div key={index} className="flex flex-row  w-full min-h-[50%] font-bold bg-white">
        {  grandtotal._id.year == `${props.fyear}` && grandtotal._id.month == `${props.fmonth}` && `${props.category}` == 'all-categories' &&
        <>
        {/*<div className="border border-amber-500 w-[200px] p-2 ">{grandtotal._id.month}/{grandtotal._id.year}</div>*/}
        <div className="border border-amber-500 w-[200px] p-2 ">GrandTotal:{grandtotal._id.month}/{grandtotal._id.year}</div>
        <div className="border border-amber-500 w-[200px] p-2 "></div>
        <div className="border border-amber-500 w-[150px] py-2">{parseFloat(grandtotal?.planamount).toFixed(2)}</div>
        <div className="border border-amber-500 w-[150px] py-2">{parseFloat(grandtotal?.amount).toFixed(2)}</div>
        <div className="border border-amber-500 w-[100px] p-2 ">{parseFloat(grandtotal?.difference).toFixed(2)}</div>
        <div className="border border-amber-500 w-[300px] p-2 "></div>
        </>}
        </div>
        
       )):("cant find any totals")
       
       }
       
        </div>
       </>
        
    )
}