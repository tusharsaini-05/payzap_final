"use client"

import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { SearchUsers } from "../components/SearchUsers"
import { useNavigate } from "react-router-dom"
import { apiService } from "../../services/apiService"
import { API_CONFIG } from "../../config/api"

export const Dashboard = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (localStorage.token) {
      console.log("Dashboard: Checking token...")

      apiService
        .checkAuth(localStorage.token)
        .then((res) => {
          console.log("Dashboard: Valid token", res.data)
          setUsername(res.data.firstName)

          // Fetch balance
          return apiService.getBalance(localStorage.token)
        })
        .then((res) => {
          console.log("Dashboard: Balance fetched", res.data)
          setBalance(res.data.balance)
        })
        .catch((err) => {
          console.error("Dashboard: Error", err)
          localStorage.clear("token")
          setError(err)

          alert("Session expired. Please sign in again.")
          navigate("/signin")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      console.log("Dashboard: No token found")
      alert("Please sign in to continue")
      navigate("/signin")
      setLoading(false)
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-slate-300 to-slate-500">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-slate-300 to-slate-500">
        <div className="text-xl text-red-600">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-slate-300 to-slate-500">
      <div className="w-3/4 bg-white m-8 p-8 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
        {/* Database Mode Indicator */}
        {API_CONFIG.USE_SUPABASE && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 text-sm rounded-lg border border-green-200">
            🗄️ Connected to Supabase Database - Real payments enabled!
          </div>
        )}

        <Appbar username={username} />
        <Balance balance={balance} />
        <SearchUsers />
      </div>
    </div>
  )
}
