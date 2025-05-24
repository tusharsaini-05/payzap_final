"use client"

import { useState } from "react"
import { SearchResultUser } from "./SearchResultUser"
import { apiService } from "../../services/apiService"
import { useNavigate } from "react-router-dom"

export const SearchUsers = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!filter.trim()) {
      alert("Please enter a search term")
      return
    }

    setLoading(true)
    try {
      const res = await apiService.searchUsers(filter, localStorage.token)
      console.log("Search results:", res.data)

      const filteredList = res.data.users.map((user) => ({
        username: `${user.firstName} ${user.lastName}`,
        userId: user._id,
      }))

      setFilteredUsers(filteredList)
    } catch (err) {
      console.error("Search error:", err)
      if (err.message.includes("token")) {
        localStorage.clear("token")
        alert("Session expired. Please sign in again.")
        navigate("/signin")
      } else {
        alert(err.message || "Search failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="m-4 mt-12 grid">
      <div className="text-xl mb-3 font-bold">Users</div>

      <div className="flex mb-4 items-center justify-between">
        <input
          onChange={(e) => setFilter(e.target.value)}
          className="border-2 pr-72 rounded p-1"
          type="text"
          placeholder="Search users ..."
          value={filter}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          type="button"
          className="p-2 px-14 mr-6 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {filteredUsers.map((user) => (
        <SearchResultUser key={user.userId} userId={user.userId} username={user.username} />
      ))}
    </div>
  )
}
