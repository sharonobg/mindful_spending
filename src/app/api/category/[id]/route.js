import connect from "../../../../libs/mongodb";
import{verifyToken} from '../../../../libs/jwt'
import Category from "../../../../models/categoryModel";


export async function GET(req,{params:{id}}){
    
    try{
    const category = await Category.findById(id).select('-password')
    return new Response(JSON.stringify(category),{status:200})
} catch (error) {
    return new Response(JSON.stringify(null),{status:500})
}
}
export async function PUT(req,{params:{id}}){
    //await connect();
    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]

    const decodedToken = verifyToken(token)
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        
        const body = await req.json()
        //console.log('body befor breaks: ',body)
        const category = await Category.findById(id);
        //console.log(category)
        
        const updatedCategory = await Category.findByIdAndUpdate(id, {$set:{...body} } ,{new: true})
    
        //console.log('updated: ',updatedCategory)

    return new Response(JSON.stringify(updatedCategory),{status: 200})

    } catch(error) {
        return new Response(JSON.stringify(null),{status:500})
    }
}

export async function DELETE(req){
    //await connect();
    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]
    const decodedToken = verifyToken(token)
    if(!accessToken || !decodedToken){
        return new Response(JSON.stringify({error: "unauthorized (wrong or expired token)"}),{status:403})
    }
    try{
        const category = await Category.findById(id);
       
        await Category.findByIdAndDelete(id)
        return new Response(JSON.stringify({message:"Category deleted"}),{status: 200})
    } catch(error) {
        console.log('Error: ',error);
        return new Response(JSON.stringify(null),{status:500})
    }
}