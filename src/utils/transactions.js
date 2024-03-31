import{verifyToken} from '../libs/jwt';
import {NextResponse} from "next/server";
import Transaction from "../models/transactionModel";
import {getServerSession} from "next-auth"
import {authOptions} from "../app/api/auth/[...nextauth]/route"

//aggregates on Transaction
export async function totalsbycategory(){
  try{
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?._id;
        //console.log(sessionUser)

        //from api/combo217 from Combo21324.jsx
        const transactionstotalcombo = await Transaction.aggregate([
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
                //setofspcat:"$setofspcat",
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
                  //mycategory: "$mycategoryId",
                  //mycategoryn:
                  //  "$mycategories.mycategoryId._id",
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
          return new Response(JSON.stringify(transactionstotalcombo),{status:200})
        }catch(error){
            return new Response(JSON.stringify(null), {status:500})
        }
        }
//from api/spending-totals-category GET
//grand totals of categories from Combo21324.jsx
export async function grandtotalscategory(){

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user?._id;
        //console.log(sessionUser)
        
        const spendingtotal= await Transaction.aggregate([
            //{ $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
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
        }
export async function transactiontitles(){
        //api/transactiontitle-totals GET from SpendingPlan.jsx
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        //console.log(sessionUser)
        
        const transactionstotal= await Transaction.aggregate([
            //{ $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
            { $match: {
                //"categoryId": { $exists: true, },
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
                  //{ 
                  //  $addFields: {
                  //    doc_date:{$month : "$transdate"},
                  //    //month_date: {"$month": new Date() } 
                  //    }
                  //},
                  {
                    $project: {
                      transdate:1,
                      descr: 1,
                      month : {$month : "$transdate"}, 
                      year : {$year :  "$transdate"},
                      date:{
                        month : {$month : "$transdate"}, 
                        year : {$year :  "$transdate"},
                      },
                      title: 1,
                      amount:1,
                      categoryId:1
                      
                      //doc_date:1
                    }
                  },
                ],
                "as": "category"
              },
              
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
                //title: "$category.title",
                title: {$toLower:"$category.title"},
                categoryId:1,
                descr: 1,
                amount:{$sum: "$amount"},
                doc_date:1,
                month_date:1
              }
            },
          
            {
              "$group" : {
                  _id:
                  { year: "$year",
                    month:"$month",
                    title:"$title",
                    categoryId:"$categoryId"}
                  
                  ,"amount": {$sum: "$amount"},
                  
                }//this groups by 
              //"$group" : {_id: "$categoryId","amount": {$sum: "$amount"}}//this groups by descr
          },
          
          {
              "$sort": {
                "year": -1,
                "month":-1
              }
          },
          
          ])
        }

//api/combo-waddfields-ttitles form SPWSpendPlanCombo.jsx
export async function SPWSpendPlanCombo(){
  const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        //console.log(sessionUser)
        
        const transactionstotalspw= await Transaction.aggregate([
            //{ $match: { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } } },//WORKS!!
            { $match: {
                //"categoryId": { $exists: true, },
                 $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } 
            }},
            {
              $lookup: {
                from: "categories",
                //localField: "_id",
                //foreignField: "categoryId",
          
                // as: "category",
                let: {
                  //title:"$category.title"
                  categoryId: "$categoryId",
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
                    $project: {
                      categoryId: 1,
                      title: 1,
                    },
                  },
                ],
                as: "category",
              },
            },
            {
              $lookup: {
                from: "spendingplans",
                // localField: "authorId",
                // foreignField: "authorId",
                let: {
                  categorytitleId: "$category._id",
                  authorId: "$authorId",
                  month: {
                    $month: "$transdate",
                  },
                  year: {
                    $year: "$transdate",
                  },
                  categoryId: "$categoryId",
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
                    $addFields: {
                      mycategories_details: {
                        $arrayElemAt: ["$mycategories", 0],
                      },
                    },
                  },
                  {
                    $project: {
                      categoryId: "$$categoryId",
                      month: "$$month",
                      year: "$$year",
                      title: 1,
                      planmonth: 1,
                      planyear: 1,
                      spendingplans_details: 1,
                      mycategories: 1,
                    },
                  },
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$planmonth", "$month"],
                          },
                          {
                            $eq: ["$planyear", "$year"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $addFields: {
                      mycategories: {
                        convertedId: {
                          $map: {
                            input:
                              "$mycategories.mycategoryId",
                            as: "mycat",
                            in: {
                              $toObjectId: {
                                $first: "$$mycat",
                              },
                            },
                            in: "$$categoryId",
                          },
                        },
                      },
                    },
                  },
                ],
                as: "spendingplans_details",
              },
            },
            {
              $project: {
                categoryId: "$categoryId",
                month: "$month",
                title: "$category.title",
                spendingplans_details: 1,
                amount:{$sum: "$amount"},
              },
            },
            {
                            "$group" : {
                                _id:
                                { year: "$year",
                                  month:"$month",
                                  planmonth:"$transactlookup.planmonth",
                                  planmonth:"$transactlookup.planyear",
                                  title:"$title",
                                  categoryId:"$categoryId",
                                  spendingplans_details:"$spendingplans_details"
                                }
                                
                                ,"amount": {$sum: "$amount"},
                                
                              }
                        },
                        
                        {
                            "$sort": {
                              "year": -1,
                              "month":-1
                            }
                        },
           
            
            ])

          }
// get transactions api/transaction get
//for TransactionsListId.jsx
export async function getTransactions() {
  try{
    await connect();
    const yeardate = params
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
  //console.log('transactions from route',transactions)
  return NextResponse.json(
    {transactions},
    {message: "Transactions list works"},
    {status: 201}
)
}catch(error){
    return new Response(JSON.stringify(null), {status:500})
}
}
