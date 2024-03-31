//import{verifyToken} from '../libs/jwt';
//import {NextResponse} from "next/server";
import Spendingplan from "../models/spendingplanModel";
import {getServerSession} from "next-auth";
import {authOptions} from "../app/api/auth/[...nextauth]/route";


//aggregate and get spendingplan functions
//api/spending-plan-alt from SPWSpendPlanCombo.jsx
export async function getSpendingPlans(params){
//export async function GET(request,params){
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
}
