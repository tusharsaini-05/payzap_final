import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { SearchUsers } from "../components/SearchUsers"
import { useNavigate } from "react-router-dom"
import axios from "axios"



export const Dashboard = ()=>{
    const navigate = useNavigate();

    const [username , setUsername]= useState('');
    const [balance , setBalance]= useState('');


    useEffect(()=>{
        
        if(localStorage.token){
            console.log('local storage has token');

            axios({
            method: 'get',
            url: 'https://backend-two-pied-99.vercel.app/api/v1/user/auth',
            headers: {
                'authorization' : `Bearer ${localStorage.token}`// Example token
            }
        })  
        
        .then((res)=> {
                console.log('valid token' , res);
                setUsername(res.data.firstName);

                axios({
                    method: 'get',
                    url: 'https://backend-two-pied-99.vercel.app/api/v1/account/balance',
                    headers: {
                        'authorization' : `Bearer ${localStorage.token}`// Example token
                    }
                })
                .then((res)=> setBalance(res.data.balance))
                .catch((err)=> console.log('error fetching balance',err));
                
            } )
            .catch((err)=> { 
                localStorage.clear('token');
                alert(JSON.stringify(err.response.data)) 
                console.log('token err',err);
                navigate('/signin');
            })
        
        }

        else {
            alert('Sign In please');
            navigate('/signin')
        }

    } , [])


    return(
        <div className=" flex justify-center items-center h-screen bg-gradient-to-r from-slate-300 to-slate-500 ">
            <div className="w-3/4 bg-white m-8 p-8 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
                <Appbar username={username}/>
                <Balance balance={balance}/>
                <SearchUsers/>
            </div>
        </div>
    )
}