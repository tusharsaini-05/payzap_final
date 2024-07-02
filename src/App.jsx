import React from "react"
import {BrowserRouter , Routes , Route, useNavigate} from 'react-router-dom'
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Dashboard } from "./pages/Dashboard"
import { SendMoney } from "./pages/SendMoney"
import { RecoilRoot } from "recoil"

function App() {
  
  

  return (
    <>
    <div className="h-screen bg-gradient-to-r from-teal-400 to-yellow-200">

    
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/send" element={<SendMoney/>}/>
        </Routes>
      </BrowserRouter>
      
    </RecoilRoot>
    </div>
    </>
  )
}

export default App
