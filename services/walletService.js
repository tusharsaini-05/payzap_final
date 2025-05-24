import { supabase } from "../lib/supabase"

export const walletService = {
  // Get user's balance
  async getBalance(userId) {
    try {
      const { data: account, error } = await supabase.from("accounts").select("balance").eq("user_id", userId).single()

      if (error) {
        throw new Error("Failed to fetch balance: " + error.message)
      }

      return { balance: Number.parseFloat(account.balance) }
    } catch (error) {
      console.error("Get balance error:", error)
      throw error
    }
  },

  // Search users
  async searchUsers(filter, currentUserId) {
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, email")
        .neq("id", currentUserId) // Exclude current user
        .or(`first_name.ilike.%${filter}%,last_name.ilike.%${filter}%,email.ilike.%${filter}%`)
        .limit(10)

      if (error) {
        throw new Error("Failed to search users: " + error.message)
      }

      return {
        users: users.map((user) => ({
          _id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
        })),
      }
    } catch (error) {
      console.error("Search users error:", error)
      throw error
    }
  },

  // Transfer money between users
  async transferMoney({ fromUserId, toUserId, amount }) {
    try {
      // Start a transaction
      const { data, error } = await supabase.rpc("transfer_money", {
        from_user_id: fromUserId,
        to_user_id: toUserId,
        transfer_amount: amount,
      })

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        message: "Transfer completed successfully",
        TxnId: data,
      }
    } catch (error) {
      console.error("Transfer error:", error)
      throw error
    }
  },
}
