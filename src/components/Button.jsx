export const Button =({onClick , label})=>{
    
    return(
        <div className=" grid rounded text-center mt-10 bg-slate-900 text-white">
            <button onClick={onClick} className="p-2 " >{label}</button>
        </div>
    )
}