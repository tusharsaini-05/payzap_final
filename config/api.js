// API Configuration
export const API_CONFIG = {
  // Your backend URL - we'll add proper error handling
  BASE_URL: "https://backend-two-pied-99.vercel.app/api/v1",
  TIMEOUT: 15000, // Increased timeout

  // Switch to real Supabase database
  USE_MOCK: false, // Now using real Supabase database
  USE_SUPABASE: true, // Enable Supabase integration
}

// Mock API responses for development (kept for fallback)
export const MOCK_RESPONSES = {
  signup: {
    success: true,
    message: "User created successfully",
    user: {
      id: "mock-user-id",
      firstName: "John",
      lastName: "Doe",
      username: "john@example.com",
    },
  },
  signin: {
    success: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token",
    message: "Login successful",
    user: {
      id: "mock-user-id",
      firstName: "John",
      lastName: "Doe",
    },
  },
  auth: {
    success: true,
    firstName: "John",
    lastName: "Doe",
    userId: "mock-user-id",
    username: "john@example.com",
  },
  balance: {
    balance: 1250.75,
  },
  users: {
    users: [
      {
        _id: "user1",
        firstName: "Alice",
        lastName: "Johnson",
      },
      {
        _id: "user2",
        firstName: "Bob",
        lastName: "Smith",
      },
      {
        _id: "user3",
        firstName: "Carol",
        lastName: "Davis",
      },
    ],
  },
  transfer: {
    success: true,
    message: "Transfer completed successfully",
    TxnId: "TXN" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  },
}
