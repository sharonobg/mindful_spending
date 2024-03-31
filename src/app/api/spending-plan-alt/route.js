//import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Spendingplan from "../../../models/spendingplanModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"

export async function GET(request,params){
    //send data as JSON
    try{
        //await connect();
        const yeardate = params
        const session = await getServerSession(authOptions);
        const sessionUser = session?.user?._id;
        //const sessionUser = session?.user?._id;
        //console.log('yeardate',yeardate)
        const spendingplan = await Spendingplan.aggregate([
          {

            "$match": { $expr : { $eq: [ '$authorId' , { $toObjectId: sessionUser } ] } }
           },
           {
              "$lookup": {
                "from": "categories",
                "let": {
                  mycategoriesId: "$mycategories._id",
                },
                "pipeline": [
                  {
                    "$match": {
                      $expr: {
                        $eq: [
                          "$_id",
                          "$$mycategoriesId"
                        ]
                      }
                    }
                  },
                  
                  {
                    "$project": {
                      title:"$category.title",
                      "descr": "$category.descr",
                      year : {$year:"$planmonthyear"},
                      month : {$month : "$planmonthyear"}, 
                      
                      "mycategories": {
                        _id:1,
                          mycategoryId:"$mycategoriesId",
                          categoryId:"$categoryId",
                          title:"$title",
                          planamount:"$mycategories.planamount",
                          
                      }
                    }
                  }
                  
                ],
                "as": "category"
              }
            },
            
            {
              "$project": {
                 
                "authorId":1,
                year : {$year:"$planmonthyear"},
                month : {$month : "$planmonthyear"},
                "title":"$title",
                "mycategories":1,
               
              }
            }
         
          
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
        //console.log('body fr route',body)//ok
        const newSpendingplan = await Spendingplan.create(body);
        //console.log('newSpendingplan fr route',newSpendingplan)
        return new Response(JSON.stringify(newSpendingplan),{status: 201})
       
    }catch (error){
        return new Response(JSON.stringify(null),{status:500,error})
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

