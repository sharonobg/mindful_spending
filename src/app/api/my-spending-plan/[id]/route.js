import{verifyToken} from '../../../../libs/jwt'
import Spendingplan from "../../../../models/spendingplanModel";

export async function GET(req,{params:{id}}){
    try{
    const spendingplan = await Spendingplan.findById(id).populate("authorId").select('-password')
    return new Response(JSON.stringify(spendingplan),{status:200})
} catch (error) {
    return new Response(JSON.stringify(null),{status:500})
}
}
export async function PUT(req,{params:{id}}){
   //connect();
    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]

    const decodedToken = verifyToken(token)
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{ 
        //const id = ctx.params.id
        const body = await req.json()
        //console.log('body befor breaks: ',body)
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        //console.log('id page spendingplan: ',spendingplan)
        if(spendingplan?.authorId?._id.toString() !== decodedToken._id.toString()){
            return new Response(JSON.stringify({message:"Only author can update his spendingplan"}),{status:403})
        }
        const updatedSpendingplan = await Spendingplan.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
    
    return new Response(JSON.stringify(updatedSpendingplan),{status: 200})


    } catch(error) {
        console.log('error: ',error)
        return new Response(JSON.stringify(null),{status:500})
        
    }
}

export async function DELETE(req, { params }){
    //await connect();
    const id = params.id;
    //console.log(id);
    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]
    const decodedToken = verifyToken(token)
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const spendingplan = await Spendingplan.findById(id).populate("authorId");
        if(spendingplan?.authorId?._id.toString() !== decodedToken._id.toString()){
            return new Response(JSON.stringify({message:"Only author can delete his spendingplan"}),{status:403})
        }
        
        await Spendingplan.findByIdAndDelete({id })
        return new Response(JSON.stringify({message:"Spendingplan deleted"}),{status: 200})
    } catch(error) {
        console.log('Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}