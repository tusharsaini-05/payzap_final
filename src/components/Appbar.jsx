import {useNavigate} from 'react-router-dom'


export const Appbar=({username})=>{

    const navigate=useNavigate();

    return(
        <div >
            <div className=" m-1 flex items-center justify-between">
                <div className="flex justify-between items-center ">
                    <img className="mr-4 object-contain h-8 w-8" src="avatar.svg" alt="Avatar" />
                    <div className="text-xl"> Hello,{username} </div>
                </div>

                <div className="text-4xl font-bold">Payments App</div>
                
                <button onClick={()=>{
                    console.log(localStorage);
                    localStorage.clear('token');
                    navigate('/signin');
                }} type="button" className="m-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                Logout
            </button>
            </div>
            <hr className="border-2"/>
        </div>
    )

}