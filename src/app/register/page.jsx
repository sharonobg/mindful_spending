"use client"
import React,{useState,useEffect} from 'react';
import {ToastContainer ,toast} from 'react-toastify';
//import classes from './register.module.css';// not sure why
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/navigation';
import {signIn} from 'next-auth/react'

const Register = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const [valid,setValid]=useState(false);
    const [showPw,setShowPw]=useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail,setConfirmEmail]=("");
    
    const [password, setPassword]=useState("")
    const [confirmPassword, setConfirmPassword] = useState("");
    //const [passType, setPassType] = useState({
    //    //password:"",
    //    showPassword:false
    //});
    
    //const showPassword = (e) => {
    //    e.preventDefault();
    //    setPassType({
    //        //...passType,
    //        setPassType:!passType.showPassword
    //    })
    //}
    //const [loggedIn,setLoggedIn] = useState(false);
const [showPass, setShowPass] = useState(false);
const toggleShowPass =(e) => {
    e.preventDefault(); 
   setShowPass(current => !current);
    //console.log(showPass)
}
    // Validate form 
    const validateForm = () => { 
        let errors = {}; 
        if (!username) { 
            errors.username = 'Username must have at least 1 uppercase letter, 1 lower case letter and at least 8 characters.'; 
            
        } else if (!/(?=.*[a-z])(?=.*[A-Z]).{8,25}/.test(username)) { 
            
            errors.username = 'Username must have at least 1 uppercase letter, 1 lower case letter and at least 8 characters.'; 
            if(!valid){setErrors(errors)}
        } 
        if (!email) { 
            errors.email = 'Email is required.'; 
        } else if (!/^(.+)@(.+)$/.test(email)) { 
            errors.email = 'Please add email in correct format.'; 
        }
        if (!password) { 
            errors.password = 'Password is required.'; 
        } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,25}/.test(password)) { 
            errors.password = 'Must contain at least one number and one uppercase and lowercase letter, one special character, and at least 12 or more characters.'; 
        }
        setErrors(errors); 
        setValid(Object.keys(errors).length === 0); 
    }
     
    //const handleChange = (event)=>{
    //    setUserData({
    //        ...userData,
    //        [event.target.name]: event.target.value
    //    })
//
    //    setErrors(validations({
    //        ...userData,
    //        [event.target.name]: event.target.value
    //    }))
    //}
    const handleSubmit= async (e) => {
        e.preventDefault();
        if (valid && password === ''||email === '' ||username === ''){
            toast.error("please fill in all the fields");
            return
        }
        


        try{
            const res = await fetch("/api/register",{
                headers:{
                    "Content-type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({username,email,password,role:"user_role"})
            })
            if (res.ok){
                router.push("/")
                toast.success("registered!")
                return
            }else{
                toast.error("Registration Error")
                return
            }
         }catch(error){

        }
    }
    useEffect(() => { 
        validateForm(); 
    }, [username, email, password]);
    useEffect(() => { 
        console.log(showPass) 
    }, [showPass]);
    return(
        <>
        
        <div className="flex flex-col w-full place-items-center">
        <div className="flex flex-col border p-4 border-blue-400 shadow-lg rounded-lg w-[50%] place-items-center">
            <div>
                <h2 className="text-3xl font-semibold text-blue-400">Register</h2>
                <form onSubmit={handleSubmit} className="flex flex-col flex-wrap gap-5 my-3">
                    <input
                    onChange={(e)=>setUsername(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md"
                        type="text"
                        placeholder='Username'
                        title="Must contain at least one uppercase letter, one lowercase letter and at least 8 characters" 
                        required
                        pattern="(?=.*[a-z])(?=.*[A-Z]).{8,25}"
                         />
                    
                    <input
                        className="p-2 border border-gray-300 rounded-md"
                        type="email"
                        placeholder='Email'
                        pattern="^(.+)@(.+)$"
                        onChange={(e)=>setEmail(e.target.value)} />
                    <input
                        className="p-2 border border-gray-300 rounded-md"
                        type={showPass ? "text" :"password"}
                        placeholder="Password"
                        autoComplete=""
                        title="Must contain at least one number and one uppercase and lowercase letter, one special character, and at least 12 or more characters" 
                        required
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,25}"
                        onChange={(e)=>setPassword(e.target.value)} 
                           
                        /> <button onClick={toggleShowPass} >show pw </button>
                        <button className="bg-blue-400 rounded-md p-3 text-white font-semibold" type="submit">Register</button>
                        
                </form>
                <button onClick={() => signIn()}>Already have an account?<br />Login now</button>
            </div>
        </div>
        </div>
        <ToastContainer />
        </>
    )
    
}

export default Register