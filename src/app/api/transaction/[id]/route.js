import connect from "../../../../libs/mongodb";
import{verifyToken} from '../../../../libs/jwt'
import Transaction from "../../../../models/transactionModel";

export async function GET(req,{params:{id}}){
    try{
    const transaction = await Transaction.findById(id).populate("authorId").select('-password')
    return new Response(JSON.stringify(transaction),{status:200})
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
        const transaction = await Transaction.findById(id).populate("authorId");
        //console.log('id page transaction: ',transaction)
        if(transaction?.authorId?._id.toString() !== decodedToken._id.toString()){
            return new Response(JSON.stringify({message:"Only author can update his transaction"}),{status:403})
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
    
    return new Response(JSON.stringify(updatedTransaction),{status: 200})


    } catch(error) {
        console.log('error: ',error)
        return new Response(JSON.stringify(null),{status:500})
        
    }
}

export async function DELETE(req, { params }){
    //await connect();
    const id = params.id;
    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]
    const decodedToken = verifyToken(token)
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const transaction = await Transaction.findById(id).populate("authorId");
        if(transaction?.authorId?._id.toString() !== decodedToken._id.toString()){
            return new Response(JSON.stringify({message:"Only author can delete his transaction"}),{status:403})
        }
        
        await Transaction.findByIdAndDelete({id })
        return new Response(JSON.stringify({message:"Transaction deleted"}),{status: 200})
    } catch(error) {
        console.log('Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}