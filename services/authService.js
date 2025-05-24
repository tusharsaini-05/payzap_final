import { supabase } from "../lib/supabase"

// Simple hash function for demo (in production, use proper backend hashing)
const simpleHash = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "salt123") // Add salt
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

const verifyPassword = async (password, hash) => {
  const inputHash = await simpleHash(password)
  return inputHash === hash
}

export const authService = {
  // Sign up a new user
  async signup({ firstName, lastName, username, password }) {
    try {
      // Hash password
      const passwordHash = await simpleHash(password)

      // Insert user into database
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert([
          {
            email: username,
            first_name: firstName,
            last_name: lastName,
            password_hash: passwordHash,
          },
        ])
        .select()
        .single()

      if (userError) {
        if (userError.code === "23505") {
          throw new Error("Email already exists")
        }
        throw new Error(userError.message)
      }

      // Create account for the user with initial balance
      const { error: accountError } = await supabase.from("accounts").insert([
        {
          user_id: user.id,
          balance: 1000.0,
        },
      ])

      if (accountError) {
        throw new Error("Failed to create account: " + accountError.message)
      }

      return { success: true, message: "User created successfully", user }
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  },

  // Sign in user
  async signin({ username, password }) {
    try {
      // Get user by email
      const { data: user, error: userError } = await supabase.from("users").select("*").eq("email", username).single()

      if (userError || !user) {
        throw new Error("Invalid email or password")
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password_hash)
      if (!isValidPassword) {
        throw new Error("Invalid email or password")
      }

      // Generate a simple token (in production, use JWT)
      const token = btoa(JSON.stringify({ userId: user.id, email: user.email }))

      return {
        success: true,
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
        },
      }
    } catch (error) {
      console.error("Signin error:", error)
      throw error
    }
  },

  // Verify token and get user info
  async verifyToken(token) {
    try {
      const decoded = JSON.parse(atob(token))

      const { data: user, error } = await supabase.from("users").select("*").eq("id", decoded.userId).single()

      if (error || !user) {
        throw new Error("Invalid token")
      }

      return {
        success: true,
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      }
    } catch (error) {
      console.error("Token verification error:", error)
      throw new Error("Invalid token")
    }
  },
}
