import { useNavigate } from "react-router-dom";
import { Inputbox } from "../components/Inputbox"
import { useEffect, useState } from "react";
import axios from "axios";
import { RecoilRoot, useRecoilValue } from "recoil";
import { RecieverAtom } from "../../store/atoms";



export const SendMoney= ({SenderName})=>{
    const navigate=useNavigate();

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
                console.log('valid token');
                
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

    } , [localStorage])

    const [amount , setAmount] = useState(0);
    const val=useRecoilValue(RecieverAtom);
    console.log(val);
    const {userId , username} =val;    

    return(
        
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-emerald-500 to-emerald-900">
        <div className="bg-white m-8 p-10 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
            <div className="text-5xl font-bold  mb-16">Send Money</div>
            <div className="flex mb-4">
            
                <img className="object-contain h-7 w-7 mr-3" src="avatar.svg" alt="Avatar" />
                <div className="text-xl font-bold">{username}</div>
            
            </div>
            <Inputbox onChange={(e)=>setAmount(e.target.value)} label={'Amount (in Rs)'} type={'number'} placeholder={'Enter Amount'}/>  
            <div className="mt-10">
            <button 
                onClick={()=>{
                    axios({
                        method: 'post',
                        url: 'https://backend-two-pied-99.vercel.app/api/v1/account/transfer',
                        headers: {
                            'authorization' : `Bearer ${localStorage.token}`// Example token
                        },
                        data : {
                            amount : amount,
                            to : userId
                        }
                    }).then((res)=> {
                            console.log(res);
                            alert(`Transfer Successful , TxnId : ${res.data.TxnId}  Redirect to Dashboard`)
                            navigate('/dashboard');
                        } )
                        .catch((err)=> { 
                            alert(JSON.stringify(err.response.data)) 
                            console.log('token err',err);
                        })
                }}
            
            
            type="button" className="w-full text-center  focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Initiate Transfer
            </button>
            </div>  
                       
        </div>    
    </div>
    )
}


