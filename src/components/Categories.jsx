const getCategories = await Category.find().sort({ title: 1 });

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