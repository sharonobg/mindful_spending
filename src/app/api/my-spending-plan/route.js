import connect from "../../../libs/mongodb";
import{verifyToken} from '../../../libs/jwt'
import {NextResponse} from "next/server";
import Spendingplan from "../../../models/spendingplanModel";
import {getServerSession} from "next-auth"
import {authOptions}from"../auth/[...nextauth]/route"

export async function GET(request){
  //send data as JSON
  try{
    
      const spendingplans= await Spendingplan.find();
      
      return NextResponse.json(
          {spendingplans
          },
          {message: "Spendingplans list works"},
          {status: 201}
      )
  }catch(error){
      return new Response(JSON.stringify(null), {status:500})
  }
}
export async function POST(request){
  await connect();
  const session = await getServerSession(authOptions);
  const sessionuser = session?.user?._id;
  const accessToken = request.headers.get("authorization")
  const token = accessToken.split(' ')[1];
  const decodedToken = verifyToken(token);
  if(!accessToken || !decodedToken){
      return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
  }
  try{
      const body = await request.json();
      const thisSpendingplan = new Spendingplan(
        {
        authorId:sessionuser,
        planmonthyear: body.planmonthyear,
        mycategories:body.mycategories
      //   mycategories : {
      //   mycategoryId:body.mycategoryId,
      //   categorynotes:body.categorynotes,
      //   explain:body.explain,
      //   // body.planamount= request.body.parseFloat(request.body.planamount).toFixed(2);
      //   planamount:body.planamount
      // }
      }
      )
      //console.log("body",body);
      //console.log('thisSpendingplan fr SP route before create',thisSpendingplan)
      const newSpendingplan = await Spendingplan.create(body)
      //console.log('newSpendingplan fr SP route create',newSpendingplan)
      return new Response(JSON.stringify(newSpendingplan),{status: 201})
     
  }catch (error){
    console.log('api error',error)
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

