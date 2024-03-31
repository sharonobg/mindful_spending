import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Spendingplan from "../../../models/spendingplanModel";
import Category from "../../../models/categoryModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"
import Transaction from "../../../models/transactionModel";
export async function GET(request,params){
    //send data as JSON
    try{
        //await connect();
        const yeardate = params
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        //const sessionUser = session?.user?._id;
        //console.log('yeardate',yeardate)
        const spendingplan = await Transaction.aggregate([
          {

            "$match": { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } }
           },
           {
            "$lookup": {
              "from": "spendingplans",
             "let": {
              month : {$month : "$transdate"},
              year  : {$year : "$transdate"},
              amount:{$sum: "$amount"},
              categoryId: {"$toString": "$categoryId"},
             },
              "pipeline": [
      
                { "$addFields": { 
                  "planmonth":  {$month:"$planmonthyear"},
                  "planyear":  {$year:"$planmonthyear"}
               }
              },
              {
                $match: {
                  $expr: {
                    $eq: [ "$planmonth", "$$month" ],
                    $eq: [ "$planyear", "$$year" ],
                  }
                }
              },
              //{ $match: { mycategories: { $elemMatch: { mycategoryId: "$$categoryId" } } } },
             //{$elemMatch:{mycategories : "$$categoryId", "$mycategories.mycategoryId" : "$$categoryId"}},
                {
                  $project:{
                  categoryId: "$$categoryId",
                  month:"$$month" ,
                  year: "$$year",  
                  amount:"$$amount",
                  planmonth:1,
                  planyear:1,
                  sumamount:{$sum: "$$amount"},
                  mycategories:"$mycategories",
                  mycategoryid:"$mycategories.mycategoryId._id" ,
                 }
                },
              ],
              
              as:"transactlookup"
            },
          },
          {
            $unwind:"$transactlookup"
          },
          
          
          {
            "$group" : {
                _id:
                { 
                  year: "$year",
                  month:"$month",
                  categoryId:"$categoryId",
                  transactlookup:"$transactlookup.planmonth",
                  transactlookup:"$transactlookup.planyear",
                  transactlookup:"$transactlookup.mycategories",
                  //transactlookupcat:"$transactlookup.mycategories.mycategoryId",
                  //transactlookupamt:"$transactlookup.mycategories.planamount",
                }
                
                ,"amount": {$sum: "$amount"},
                
              }//this groups by 
            //"$group" : {_id: "$categoryId","amount": {$sum: "$amount"}}//this groups by descr
        },
      
          
          
          
        ])

      return new Response(JSON.stringify(spendingplan),{status:200})
    
    }catch(error){
        return new Response(JSON.stringify(null), {status:500})
    }
}

export async function POST(request){
    //await connect();
    const accessToken = request.headers.get("authorization")
    const token = accessToken.split(' ')[1];
    const decodedToken = verifyToken(token);
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const body = await request.json();
        const newSpendingplan = await Spendingplan.create(body);
       
        console.log('newSpendingplan fr route',newSpendingplan)
        return new Response(JSON.stringify(newSpendingplan),{status: 201})
       
    }catch (error){
      console.log(error)
      return (
        new Response(JSON.stringify(null),{status:500,error})
      )
    }
}
export async function DELETE(request){
    //send data as json
    const id = request.nextUrl.searchParams.get('id');
    //await connect();
    await Spendingplan.findByIdAndDelete(id);
    return NextResponse.json(
        
        {message: "Spendingplan deleted"},
        {status: 200}
    )
}

