
import { useEffect, useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { Inputbox } from "../components/Inputbox"
import { Subheading } from "../components/Subheading"
import {useNavigate} from 'react-router-dom'

import axios from 'axios'

export const Signin = ()=>{
    const navigate=useNavigate();
    const [username , setUserName]= useState('');
    const [password , setPassword]= useState('');

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




    return(
    
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-400 to-yellow-200 ">
            <div className="bg-white m-8  p-12 pt-8 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
                <Heading label={'Sign In'}/>        
                <Subheading className='text-center' label={'Enter your credentials for login'}/>        
                <Inputbox onChange= {e=> setUserName(e.target.value)} type='email'label={'Email '} placeholder={'johndoe123@gmail.com'}/>
                <Inputbox onChange= {e=> setPassword(e.target.value)} type='password'label={'Password '} placeholder={'John123456*'}/>
                <Button onClick= {async()=> {
                    axios({
                        method: 'post',
                        url: 'https://backend-two-pied-99.vercel.app/api/v1/user/signin',
                        data: {
                            username,
                            password
                        }
                        })
                        .then((res)=> {
                            console.log(res);
                            localStorage.setItem('token' ,res.data.token);
                            navigate('/');
                        } )
                        .catch((err)=> alert(JSON.stringify(err.response.data))) 
                } 
                            }  label={'Sign In'}/>
                <BottomWarning warning={' Don\'t have an account? '} urltext={' Sign-Up'} url={'/signup'}/>
            </div>    
        </div>
            
    )
}


