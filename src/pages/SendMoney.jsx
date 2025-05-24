"use client"

import { useNavigate } from "react-router-dom"
import { Inputbox } from "../components/Inputbox"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { RecieverAtom } from "../../store/atoms"
import { apiService } from "../../services/apiService"

export const SendMoney = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const val = useRecoilValue(RecieverAtom)
  const { userId, username } = val

  useEffect(() => {
    if (!userId || !username) {
      alert("No recipient selected. Please go back and select a user.")
      navigate("/")
      return
    }

    if (localStorage.token) {
      console.log("SendMoney: Checking token...")

      apiService
        .checkAuth(localStorage.token)
        .then((res) => {
          console.log("SendMoney: Valid token")
        })
        .catch((err) => {
          localStorage.clear("token")
          alert("Session expired. Please sign in again.")
          console.log("SendMoney: Token error", err)
          navigate("/signin")
        })
    } else {
      alert("Please sign in to continue")
      navigate("/signin")
    }
  }, [navigate, userId, username])

  const handleTransfer = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    if (!userId) {
      alert("No recipient selected")
      return
    }

    setLoading(true)
    try {
      const response = await apiService.transferMoney(
        {
          amount: Number.parseFloat(amount),
          to: userId,
        },
        localStorage.token,
      )

      console.log("Transfer successful:", response.data)
      alert(`Transfer Successful! Transaction ID: ${response.data.TxnId}`)
      navigate("/")
    } catch (err) {
      console.error("Transfer error:", err)
      alert(err.message || "Transfer failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-emerald-500 to-emerald-900">
      <div className="bg-white m-8 p-10 rounded-3xl shadow-md transition duration-300 ease-in-out hover:shadow-2xl">
        <div className="text-5xl font-bold mb-16">Send Money</div>
        <div className="flex mb-4">
          <img className="object-contain h-7 w-7 mr-3" src="avatar.svg" alt="Avatar" />
          <div className="text-xl font-bold">{username}</div>
        </div>
        <Inputbox
          onChange={(e) => setAmount(e.target.value)}
          label={"Amount (in $)"}
          type={"number"}
          placeholder={"Enter Amount"}
        />
        <div className="mt-10">
          <button
            onClick={handleTransfer}
            disabled={loading}
            type="button"
            className="w-full text-center focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Initiate Transfer"}
          </button>
        </div>
      </div>
    </div>
  )
}
