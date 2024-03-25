"use client"
import {useRouter} from 'next/navigation';
import {HiOutlineTrash} from "react-icons/hi";

export default function RemoveBtn({id}) {
    const router = useRouter();
    const removeTransaction = async () => {
        const confirmed = confirm("Are you sure?");
        if(confirmed){
<<<<<<< HEAD
=======
            //const res = await fetch(`http://localhost:3000/api/transaction?id=${id}`, {
>>>>>>> 427f795e2bfa429da2caaa63c57967e8804ce5a4
            const res = await fetch(`/api/transaction?id=${id}`, {
                method: "DELETE"
            });
            if(res.ok){
                router.refresh();
            }
            
        }
    };
    return (
        <button onClick={removeTransaction}
            className="text-red-500 p-0 m-0">
            <HiOutlineTrash size={24} />
        </button>
    )
}