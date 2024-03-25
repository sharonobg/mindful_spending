import {headers} from "next/headers"

const getCategories = async () => {
    try{
<<<<<<< HEAD
        const res = await fetch("https://sharonobrien.com/api/category",{
=======
        const res = await fetch("https://mindful-spending-22924.vercel.app/api/category",{
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
           //cache: 'no-store',
           method: "GET",
           headers: headers(),
        });
        if(!res.ok){
            throw new Error("Failed to fetch categories");
        }
        //console.log('route categories',{categories})
        return res.json();
    }catch(error){
        console.log("Error finding categories",error)
    }

}
export default async function CategoryListing() {

    const {categories} = await getCategories();
    //console.log('categories: ',categories)

    return(
        <div className="my-5 flex flex-col place-items-center">
        {categories?.length > -1 ? (categories.map((category) => 
            <>
            <div key={category._id} className="flex flex-row  w-full min-h-[50%] bg-white">
                <div>{category.title}</div>
            </div>
            </>
            )):("cant find any categories")
       
    }
    </div>
    )
}