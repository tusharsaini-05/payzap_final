"use client"

import { useEffect, useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { Inputbox } from "../components/Inputbox"
import { Subheading } from "../components/Subheading"
import { useNavigate } from "react-router-dom"
import { apiService } from "../../services/apiService"
import { API_CONFIG } from "../../config/api"

export const Signup = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState("checking")

  useEffect(() => {
    // Check if user is already logged in
    if (localStorage.token) {
      console.log("User already has token, checking validity...")
      apiService
        .checkAuth(localStorage.token)
        .then(() => {
          console.log("Valid token, redirecting to dashboard")
          navigate("/")
        })
        .catch(() => {
          console.log("Invalid token, clearing localStorage")
          localStorage.clear()
        })
    }

    // Test backend connectivity
    apiService.testConnection().then((isConnected) => {
      setBackendStatus(isConnected ? "connected" : "disconnected")
    })
  }, [navigate])

  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !password) {
      alert("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    console.log("Attempting signup with:", { firstName, lastName, username })

    try {
      const response = await apiService.signup({
        firstName,
        lastName,
        username,
        password,
      })

      console.log("Signup successful:", response.data)
      alert("Account created successfully! Please sign in.")
      navigate("/signin")
    } catch (error) {
      console.error("Signup error:", error)
      alert(error.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-400 to-yellow-200">
      <div className="bg-white m-8 p-8 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
        {/* Database Status Indicator */}
        <div className="mb-4 text-center">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              API_CONFIG.USE_SUPABASE
                ? "bg-green-100 text-green-800"
                : backendStatus === "connected"
                  ? "bg-green-100 text-green-800"
                  : backendStatus === "disconnected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                API_CONFIG.USE_SUPABASE
                  ? "bg-green-500"
                  : backendStatus === "connected"
                    ? "bg-green-500"
                    : backendStatus === "disconnected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
              }`}
            ></div>
            {API_CONFIG.USE_SUPABASE && "Supabase Database Connected"}
            {!API_CONFIG.USE_SUPABASE && backendStatus === "connected" && "Backend Connected"}
            {!API_CONFIG.USE_SUPABASE && backendStatus === "disconnected" && "Backend Offline"}
            {!API_CONFIG.USE_SUPABASE && backendStatus === "checking" && "Checking Connection..."}
          </div>
        </div>

        <Heading label={"Sign Up"} />
        <Subheading label={"Enter your information to create an account"} />
        <Inputbox
          type="text"
          onChange={(e) => setFirstName(e.target.value)}
          label={"First Name "}
          placeholder={"John"}
        />
        <Inputbox type="text" onChange={(e) => setLastName(e.target.value)} label={"Last Name "} placeholder={"Doe"} />
        <Inputbox
          type="email"
          onChange={(e) => setUserName(e.target.value)}
          label={"Email "}
          placeholder={"johndoe123@gmail.com"}
        />
        <Inputbox
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          label={"Password "}
          placeholder={"John123456*"}
        />
        <Button onClick={handleSignup} label={loading ? "Creating Account..." : "Sign Up"} />
        <BottomWarning warning={"Already have an account? "} urltext={" Sign-In"} url={"/signin"} />
      </div>
    </div>
  )
}
