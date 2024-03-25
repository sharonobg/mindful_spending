"use client"

import React,{useState,useEffect} from 'react';
import {useRouter,useSearchParams,useParams} from 'next/navigation';
import {ToastContainer ,toast} from 'react-toastify';
import {useSession} from 'next-auth/react'

export default function SimpleFilterTransaction() {
//export default function FilterTransaction ()  {
    //get the year and the month - get the months up to the current month
    //get the previous year - get the months from the first month available to the end of the year
    //date details:
    const newD = new Date()
   
    const getMonth = new Date().getMonth()
    //const monthLong = newD.toLocaleString('default', { month: 'long' });
    const getYear = new Date().getFullYear()
    //const getMonthYear = getMonth +', ' +getYear;
    //const [transdate,setTransdate]= useState(new Date())
    const [categories,setCategories]=useState([])
    const [categoryId,setCategoryId]= useState("")
    const [categoryTitle,setCategoryTitle]= useState("")
    const [filters,setFilters]=useState([])
    const [datesfilter,setDatesfilter]=useState("")
    //const [transactionstotal,setTransactionstotal]=useState([])
    const [fmonth,setFmonth]=useState('')
    const {data:session,status} = useSession();
    const router= useRouter();
    const searchParams = useSearchParams();
    const queryCategory = searchParams.get('category');
    const queryMonth = searchParams.get('fmonth');
    const queryYear = searchParams.get('fyear');
    //console.log('queryCategory filter: ',queryCategory)
    //console.log('queryMonth filter: ',queryMonth)
    //console.log('queryYear filter: ',queryYear)
    //console.log('params useParams filter: ', params)
   // console.log('prop search filter:',search)

    //list of options with current year, all months up to and including the current month.
    //create api endpoint to retrieve all transactions OR use the api/transaction already there 
    //get months with transaction transaction month/years in array by lookup then export only the month/date as array
    //set array into dropdown as options (see categories dropdown)
    //route push year and month to params for month selected
    //do same for Categories in params

//console.log('path',router.pathname);
    


    //const filtersearch = new URLSearchParams({searchParams});
    //const filteryear = searchParams.fyear ? searchParams.fyear : "not there";
    //console.log('filtersearch',{searchParams})
        useEffect(() => {
            //fetch('http://localhost:3000/api/newsimplefilter')
            fetch('/api/newsimplefilter')
            .then((res) => res.json())
              .then((filters) => {
                //console.log('filters: ',filters)
                setFilters(filters)
              })
            },[])

          useEffect(() => {
            fetch('/api/category')
            //fetch('http://localhost:3000/api/category')
              .then((res) => res.json())
              .then(({categories}) => {
                setCategories(categories)
                //console.log('categories: ',categories)
              })
          }, [])
          //function hasQueryParams(url) {
          //  return url.includes('?');
          //}
          //console.log(hasQueryParams(url))
    const clearFilter = (e) => {
      e.preventDefault();
     //console.log('filter params', params)
     router.push(`/?fyear=${queryYear ? queryYear : getYear }&fmonth=${queryMonth ? queryMonth : getMonth+1 }&category=all-categories`)

    }
    const categoryFilter = (e) => {
      e.preventDefault();
      
      //const datesfilterVal = datesfilter ? datesfilter : fmonth;
      //const params = searchParams ? searchParams : undefined;'
      //let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
      //let newMonth = datesfilterVal.slice(0, - 4); 
      let categoryT = categoryTitle.toLowerCase();
      //let qm = queryMonth?queryMonth:"no month";
      //console.log('qm?: ',qm)
      //console.log('params props newYear filter: ',newYear)
      //console.log('params props category filter: ',categoryTitle)
      //console.log('params props dates filter: ',datesfilterVal)
      router.push(`/?fyear=${queryYear ? queryYear : getYear }&fmonth=${queryMonth ? queryMonth : getMonth+1 }&category=${categoryT}`)

      //console.log('categories: ',categories)
  // if fmonth = the transaction month = show results = else hide results
  //console.log('filters - filter month: ',fmonth)
  //router.refresh() 
  }
    const dateFilter = (e) => {
        e.preventDefault();
        const datesfilterVal = datesfilter ? datesfilter : fmonth;
        let newYear = datesfilterVal.slice(datesfilterVal.length - 4); 
        let newMonth = datesfilterVal.slice(0, - 4); 
        //let categoryT = categoryTitle.toLowerCase();
        //console.log('datesfilterVal filter: ',datesfilterVal)
        //console.log('params props newMonth filter: ',newMonth)
        //console.log('params props newYear filter: ',newYear)
        //console.log('params props category filter: ',categoryTitle)
        //console.log('params props dates filter: ',datesfilterVal)
        router.push(`/?fyear=${newYear ? newYear: queryYear}&fmonth=${newMonth ? newMonth : queryMonth}&category=${queryCategory ? queryCategory : "all-categories"}`)

        //console.log('categories: ',categories)
    // if fmonth = the transaction month = show results = else hide results
    //console.log('filters - filter month: ',fmonth)
    //router.refresh() 
    }
    //console.log('filter month: ',fmonth)
    //console.log('new date: ',newD)

    //const FilterProvider = ({ children, fmonth }) => (
    //    <FilterProvider fmonth={fmonth}>
    //        {children}
    //    </FilterProvider>
    //)
    return(
        <>
        <div className="flex flex-col w-full place-items-center border-l-orange-100">
            
            <form onSubmit={categoryFilter} className="flex flex-col flex-wrap gap-5 my-3">
            <h2>Filter by Category</h2>
                <div className="flex flex-row">
                <select onChange={(e) => setCategoryTitle(e.target.value)} className="m-2">
                    {categories?.length > -1 ? 
                    (categories.map((categorych,index) => 
                        <option key={index} value={categorych.title}>{categorych.title}</option>

                   ) ): "no categories are available"}</select>
                   <button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold"  type="submit">Choose Category</button>
                   <button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold"  onClick={clearFilter}>Clear filter</button>
              </div>
            </form>

        </div>

        <div className="flex flex-col w-full place-items-center border-l-orange-100">
          <form onSubmit={dateFilter} className="flex flex-col flex-wrap gap-5 my-3">
            <h2>Choose a Different Month</h2>
            <div className="flex flex-row align-middle">
              <select onChange={(e) => setDatesfilter(e.target.value)} className="m-2">
                {filters?.length > -1 ? 
                  (filters.map((filter,index) =>
                  {return(
                    <option key={index} value={`${filter._id.month}${filter._id.year}`}>{filter._id.month}/{filter._id.year}</option>
                )}
                )): "no dates are available"}
              </select><button className="bg-blue-400 rounded-md p-1 m-2 h-fit justify-center align-middle text-white font-semibold flex" type="submit">Choose Month</button>
            </div>
          </form>
        </div>
                  
        
        </>)
}
//export default SimpleFilterTransaction
