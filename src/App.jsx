import React from "react"
import {BrowserRouter , Routes , Route, useNavigate} from 'react-router-dom'
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Dashboard } from "./pages/Dashboard"
import { SendMoney } from "./pages/SendMoney"
import { RecoilRoot } from "recoil"


function App() {
  
  const navigate= useNavigate();
  

  return (
    <>
    <div className="h-screen bg-gradient-to-r from-teal-400 to-yellow-200">

        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/send" element={<SendMoney/>}/>
        </Routes>
    </div>
    </>
  )
}

export default App
