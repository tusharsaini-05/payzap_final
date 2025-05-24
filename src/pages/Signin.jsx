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

export const Signin = () => {
  const navigate = useNavigate()
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.token) {
      console.log("Checking existing token...")
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
  }, [navigate])

  const handleSignin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    console.log("Attempting signin with username:", username)

    try {
      const response = await apiService.signin({
        username,
        password,
      })

      console.log("Signin successful:", response.data)

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        console.log("Token saved to localStorage")
        navigate("/")
      } else {
        alert("Login successful but no token received")
      }
    } catch (error) {
      console.error("Signin error:", error)
      alert(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-400 to-yellow-200 ">
      <div className="bg-white m-8  p-12 pt-8 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
        {/* Database Status Indicator */}
        {API_CONFIG.USE_SUPABASE && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 text-sm rounded-lg border border-green-200">
            🗄️ Real Database - Use existing account or sign up first!
          </div>
        )}

        <Heading label={"Sign In"} />
        <Subheading className="text-center" label={"Enter your credentials for login"} />
        <Inputbox
          onChange={(e) => setUserName(e.target.value)}
          type="email"
          label={"Email "}
          placeholder={"johndoe123@gmail.com"}
        />
        <Inputbox
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label={"Password "}
          placeholder={"John123456*"}
        />
        <Button onClick={handleSignin} label={loading ? "Signing In..." : "Sign In"} />
        <BottomWarning warning={" Don't have an account? "} urltext={" Sign-Up"} url={"/signup"} />
      </div>
    </div>
  )
}
