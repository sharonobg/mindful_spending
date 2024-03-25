import Link from 'next/link';
import {getServerSession} from "next-auth";
import connect from '../../libs/mongodb'
import TransactionsListId from '../../components/TransactionsListId';
//import TransactionsListIdClient from '../components/TransactionsListIdClient';
import SimpleFilters from '../../components/SimpleFilters';
//import SpendingPlan from '../components/SpendingPlan';
//
//import SPWSpendPlanCombo from '../../components/SPWSpendPlanCombo';
//import Combo21324 from '../../components/Combo21324';
//import Categories from '../../components/Categories';


export default async function Dashboard({searchParams}) {
  
  await connect()
  const session = await getServerSession();
  //filter - default is current month but can select from a dropdown of all months

  //let query = filters;
const getMonth = new Date()
const month = getMonth.toLocaleString('default', { month: 'long' });
const thisMonth = new Date().getMonth()+1;//this is default
console.log('thisMonth',thisMonth)
const thisYear = new Date().getFullYear()
//console.log('home props',searchParams)
//const filteryear = searchParams.fyear? searchParams.fyear : thisYear;
//const filtermonth = searchParams.fmonth? searchParams.fmonth : thisMonth;
//const filtermonthtotal=searchParams.fmonth? searchParams.fmonth : thisMonth;
//const filtercategory= searchParams.category? searchParams.category : "all-categories"
const filteryear = 2024;
const filtermonth = 3;
const filtermonthtotal=searchParams.fmonth? searchParams.fmonth : thisMonth;
const filtercategory=  "all-categories"
//console.log('prop searchParams:',searchParams)
//console.log('propFilteryear:',filteryear)
//console.log('propFiltermonth:',filtermonth)
//console.log('propCategory:',filtercategory)

  return (
    <>
   
    <main className="flex flex-col place-content-center text-center py-5">
    
    {session?.user?.email ? 
    (
      <>
      <h1>Month:{filtermonth}/{filteryear}     Category: {filtercategory ? filtercategory : "All-Categories"}</h1>
      <SimpleFilters />
      {/*<SPWSpendPlanCombo fyear={filteryear} fmonth={filtermonth}category={filtercategory} />
      <Combo21324 fyear={filteryear} fmonth={filtermonth} category={filtercategory} />
      <SpendingPlan fyear={filteryear} fmonth={filtermonth} category={filtercategory} />*/}
      {/*<TransactionsListId fmonth={searchParams?.fmonth|thisMonth} category={searchParams?.category|undefined}/>*/}
      <TransactionsListId fyear={filteryear} fmonth={filtermonth} category={filtercategory} />
      </>
      ):(
        <Link href="/login">
        {session?.user?.name ? (<h2>{session?.user?.name}</h2>):(<h2 className="text-blue-700 text-lg">You Are Not logged in</h2>)}
        <h1 className="text-blue-500 border-b-2 border-blue-500 border-spacing-1">Please log in to see your Spending Plan</h1>
        </Link>
      )
      }
    </main>
    </>
  )
}
