export const Inputbox = ({label , placeholder , type, onChange })=>{
    return <div className="grid grid-cols-1 mb-3">
        <label className="font-bold" htmlFor="">
            {label}
        </label>
        <input onChange={onChange} className="border-2 rounded p-3 mt-3" type={type} placeholder={placeholder}/>
    </div>
}