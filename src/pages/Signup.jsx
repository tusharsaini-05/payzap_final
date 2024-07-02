import { useEffect, useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { Inputbox } from "../components/Inputbox"
import { Subheading } from "../components/Subheading"



import axios from 'axios';
import { useNavigate } from "react-router-dom"


export const Signup = ()=>{

    const navigate = useNavigate();

    // <div className="flex justify-center m-72 bg-slate-300 mt-0 p-10"></div>
    
    useEffect(()=>{
        
        if(localStorage.token){
            console.log('local storage has token');
            axios({
            method: 'get',
            url: 'https://backend-two-pied-99.vercel.app/api/v1/user/auth',
            headers: {
                'authorization' : `Bearer ${localStorage.token}`// Example token
            }
        }).then((res)=> {
                //console.log(res);
                navigate('/dashboard');
            } )
            .catch((err)=> { 
                localStorage.clear('token');
                alert(JSON.stringify(err.response.data)) 
                console.log('token err',err);
            })
        }

    } , []) 
    
    
    const [firstName , setFirstName]= useState('');
    const [lastName , setLastName]= useState('');
    const [username , setUserName]= useState('');
    const [password , setPassword]= useState('');
    
    



    return(
    
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-400 to-yellow-200">
            <div className="bg-white m-8 p-8 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
                <Heading label={'Sign Up'}/>        
                <Subheading label={'Enter your information to create an account'}/>        
                <Inputbox type='text' onChange= {e=> setFirstName(e.target.value)} label={'First Name '} placeholder={'John'}/>
                <Inputbox type='text' onChange= {e=> setLastName(e.target.value)} label={'Last Name '} placeholder={'Doe'}/>
                <Inputbox type='email'onChange= {e=> setUserName(e.target.value)} label={'Email '} placeholder={'johndoe123@gmail.com'}/>
                <Inputbox type='password'onChange= {e=> setPassword(e.target.value)} label={'Password '} placeholder={'John123456*'}/>
                <Button onClick= {async()=> {
                    axios({
                        method: 'post',
                        url: 'https://backend-two-pied-99.vercel.app/api/v1/user/signup',
                        data: {
                            firstName,
                            lastName,
                            username,
                            password
                        }
                        })
                        .then((res)=>{
                            console.log(res);
                            alert('Sign-In Now!'); 
                            navigate('/signin');
                        })
                        .catch((err)=> alert(JSON.stringify(err.response.data))) 
                } 
                                }  label={'Sign Up'} />
                <BottomWarning warning={'Already have an account? '} urltext={' Sign-In'} url={'/signin'}/>
            </div>    
        </div>
            
    )
}