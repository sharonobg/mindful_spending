'use server'
import {redirect} from 'next/navigation'

export const filterTrans = async(formData)=> {
    //e.preventDefault();
    const transactionFilters = formData.getAll('filters')
    //const params = new URLSearchParams([
    //            ['filters',transactionFilters.join(',')]
    //        ])
    //console.log('parms',params)
    //console.log('transactionFilters',transactionFilters)
    //if(transactionFilters.length > 0){
        const params = new URLSearchParams([
            ['filters',transactionFilters.join(',')]
        ])
        //console.log(params)
    //}
    //console.log("no params")
    redirect('/?${params}')
    
}
export const updateFilters = async(formData)=> {
    //e.preventDefault();
    const transactionFilters = formData.getAll('filters')
    //const params = new URLSearchParams([
    //            ['filters',transactionFilters.join(',')]
    //        ])
    //console.log('parms',params)
    //console.log('transactionFilters',transactionFilters)
    //if(transactionFilters.length > 0){
        const params = new URLSearchParams([
            ['filters',transactionFilters.join(',')]
        ])
        //console.log(params)
    //}
    //console.log("no params")
    redirect('/?${params}')
    
    
}

