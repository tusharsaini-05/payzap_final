export const Balance=({balance})=>{

    return(
        <div className="flex text-xl  m-4 mt-12 items-center ">
            <div className="font-bold mr-3">Your Balance : </div>
            <div className=" items-center">${balance}</div>
        </div>
    )

}