import {useNavigate} from 'react-router-dom'
import { useSetRecoilState } from 'recoil';

import { RecieverAtom } from '../../store/atoms';



export const SearchResultUser = ({username,userId})=>{
    const navigate = useNavigate();
    
    const setReciver = useSetRecoilState(RecieverAtom);
    

    return (
        
        <div>
            <div className="flex m-3 justify-between">
            <div className="flex items-center">
                <img className="object-contain h-7 w-7 mr-3" src="avatar.svg" alt="Avatar" />
                <div className="text-lg ">{`${username}`}</div>
            </div>
            
                <button type="button" className="mt-1 ml-3 px-10 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={()=>{
                            
                            setReciver({
                                username : username,
                                userId : userId
                            });

                            navigate('/send');
                    }}
                
                >
                    Send Money
                </button>
        </div>
        <hr className="border-2"/>

        </div>
    )
}