import axios from "axios"
import { API_CONFIG, MOCK_RESPONSES } from "../config/api"
import { authService } from "./authService"
import { walletService } from "./walletService"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
})

// Mock delay to simulate network
const mockDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper to get user ID from token
const getUserIdFromToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token))
    return decoded.userId
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// API Service functions
export const apiService = {
  // Test backend connectivity
  async testConnection() {
    if (API_CONFIG.USE_SUPABASE) {
      return true // Supabase is always available
    }

    try {
      // Test if the backend root is accessible
      const response = await fetch("https://backend-two-pied-99.vercel.app", {
        method: "GET",
        mode: "cors",
      })

      // Even if it returns 404, it means the server is up
      return response.status === 404 || response.ok
    } catch (error) {
      console.log("Backend connection test failed:", error)
      return false
    }
  },

  // Signup
  async signup(userData) {
    if (API_CONFIG.USE_SUPABASE) {
      console.log("🔗 Using Supabase signup")
      return { data: await authService.signup(userData) }
    }

    if (API_CONFIG.USE_MOCK) {
      console.log("🔧 Using mock signup")
      await mockDelay()

      // Simulate validation
      if (!userData.firstName || !userData.lastName || !userData.username || !userData.password) {
        throw new Error("All fields are required")
      }

      if (userData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      return { data: MOCK_RESPONSES.signup }
    }

    try {
      const response = await apiClient.post("/user/signup", userData)
      return response
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new Error("Backend server is not responding. Using mock mode for now.")
      }
      throw error
    }
  },

  // Signin
  async signin(credentials) {
    if (API_CONFIG.USE_SUPABASE) {
      console.log("🔗 Using Supabase signin")
      return { data: await authService.signin(credentials) }
    }

    if (API_CONFIG.USE_MOCK) {
      console.log("🔧 Using mock signin")
      await mockDelay()

      // Simulate validation
      if (!credentials.username || !credentials.password) {
        throw new Error("Email and password are required")
      }

      // Simulate wrong credentials
      if (credentials.password === "wrong") {
        throw new Error("Invalid email or password")
      }

      return { data: MOCK_RESPONSES.signin }
    }

    try {
      const response = await apiClient.post("/user/signin", credentials)
      return response
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new Error("Backend server is not responding. Using mock mode for now.")
      }
      throw error
    }
  },

  // Auth check
  async checkAuth(token) {
    if (API_CONFIG.USE_SUPABASE) {
      console.log("🔗 Using Supabase auth check")
      return { data: await authService.verifyToken(token) }
    }

    if (API_CONFIG.USE_MOCK) {
      console.log("🔧 Using mock auth check")
      await mockDelay(300)

      // Simulate invalid token
      if (token === "invalid") {
        throw new Error("Invalid token")
      }

      return { data: MOCK_RESPONSES.auth }
    }

    try {
      const response = await apiClient.get("/user/auth", {
        headers: { authorization: `Bearer ${token}` },
      })
      return response
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new Error("Backend server is not responding.")
      }
      throw error
    }
  },

  // Get balance
  async getBalance(token) {
    if (API_CONFIG.USE_SUPABASE) {
      console.log("🔗 Using Supabase balance")
      const userId = getUserIdFromToken(token)
      return { data: await walletService.getBalance(userId) }
    }

    if (API_CONFIG.USE_MOCK) {
      console.log("🔧 Using mock balance")
      await mockDelay(400)
      return { data: MOCK_RESPONSES.balance }
    }

    try {
      const response = await apiClient.get("/account/balance", {
        headers: { authorization: `Bearer ${token}` },
      })
      return response
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new Error("Backend server is not responding.")
      }
      throw error
    }
  },

  // Search users
  async searchUsers(filter, token) {
    if (API_CONFIG.USE_SUPABASE) {
      console.log("🔗 Using Supabase user search")
      const userId = getUserIdFromToken(token)
      return { data: await walletService.searchUsers(filter, userId) }
    }

    if (API_CONFIG.USE_MOCK) {
      console.log("🔧 Using mock user search")
      await mockDelay(600)

      // Filter mock users based on search term
      const filteredUsers = MOCK_RESPONSES.users.users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
          user.lastName.toLowerCase().includes(filter.toLowerCase()),
      )

      return { data: { users: filteredUsers } }
    }

    try {
      const response = await apiClient.get(`/user/bulk?filter=${filter}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      return response
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new Error("Backend server is not responding.")
      }
      throw error
    }
  },

  // Transfer money
  async transferMoney(transferData, token) {
    if (API_CONFIG.USE_SUPABASE) {
      console.log("🔗 Using Supabase transfer")
      const fromUserId = getUserIdFromToken(token)
      return {
        data: await walletService.transferMoney({
          fromUserId,
          toUserId: transferData.to,
          amount: transferData.amount,
        }),
      }
    }

    if (API_CONFIG.USE_MOCK) {
      console.log("🔧 Using mock transfer")
      await mockDelay(1000)

      if (!transferData.amount || transferData.amount <= 0) {
        throw new Error("Invalid amount")
      }

      if (!transferData.to) {
        throw new Error("Recipient is required")
      }

      return { data: MOCK_RESPONSES.transfer }
    }

    try {
      const response = await apiClient.post("/account/transfer", transferData, {
        headers: { authorization: `Bearer ${token}` },
      })
      return response
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new Error("Backend server is not responding.")
      }
      throw error
    }
  },
}
