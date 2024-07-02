import { useState } from "react"
import { SearchResultUser } from "./SearchResultUser"
import axios from "axios";
import { RecoilRoot } from "recoil";

export const SearchUsers=()=>{

    const [filter ,setFilter]=useState('');
    const [filteredUsers , setfilteredUsers] = useState([]);


    return(
        <div className="m-4 mt-12 grid">
            <div className="text-xl mb-3 font-bold">Users</div>
            
            <div className="flex mb-4 items-center justify-between">
                <input onChange={(e)=> setFilter(e.target.value)} className="border-2  pr-72 rounded p-1" type="text" placeholder="Search users ..." />
                <button onClick={()=>{

                axios({
                    method: 'get',
                    url: `https://backend-two-pied-99.vercel.app/api/v1/user/bulk?filter=${filter}`,
                    headers: {
                        'authorization' : `Bearer ${localStorage.token}`// Example token
                    }
                }).then((res)=> {
                        console.log('valid token');
                        const filteredList= res.data.users.map((user)=> {
                            return {
                                username : `${user.firstName} ${user.lastName}`,
                                userId : user._id
                            }
                                } )
                        setfilteredUsers(filteredList);
                    
                    } )
                    .catch((err)=> { 
                        localStorage.clear('token');
                        alert(JSON.stringify(err.response.data)) 
                        console.log('token err',err);
                        navigate('/signin');
                    })
                

                }} type="button" className=" p-2 px-14 mr-6 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        Search
                </button>    
            </div>
            
            {filteredUsers.map((user)=> <SearchResultUser key={user.userId} userId={user.userId} username={user.username}/>)}
            
        </div>
        
    )

}