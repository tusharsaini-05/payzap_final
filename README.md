# 💳 Payments App

A modern, full-stack payments application built with React, Vite, and Supabase. Send money securely between users with real-time balance updates and transaction tracking.

![Dashboard](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-24%20at%201.08.57%E2%80%AFPM-UUb2AAw78oD4O694FgSceTpoJpfiiU.png)

## ✨ Features

- 🔐 **Secure Authentication** - User registration and login with password hashing
- 💰 **Real-time Wallet System** - Each user starts with $1000 balance
- 🔍 **User Search** - Find other users by name or email
- 💸 **Instant Money Transfers** - Send money between accounts with atomic transactions
- 📊 **Live Balance Updates** - See your balance update in real-time
- 🗄️ **Supabase Database** - Persistent data storage with PostgreSQL
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Recoil
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with secure password hashing
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with gradient backgrounds

## 📸 Screenshots

### Sign Up
![Sign Up](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-24%20at%201.08.26%E2%80%AFPM-juPRkXu1tr4NgZ1B5vCRuDmOZBJa34.png)

### Sign In
![Sign In](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-24%20at%201.08.19%E2%80%AFPM-Cq5VheJT5BjPEjM9mUUQQgJzUmoGll.png)

### Dashboard
![Dashboard Clean](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-24%20at%201.08.38%E2%80%AFPM-Ccti9R2kavSjMA4JzcDLpq5qnwpbvw.png)

### Send Money
![Send Money](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-24%20at%201.09.10%E2%80%AFPM-qt7NYGjZcvxurmC9lFGH4uVd1jtbOw.png)

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/payments-app.git
cd payments-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your keys
3. Create a `.env.local` file in the root directory:

```env
VITE_PUBLIC_SUPABASE_URL=your_supabase_project_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table for wallet balances
CREATE TABLE accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) DEFAULT 1000.00 NOT NULL CHECK (balance >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id UUID NOT NULL REFERENCES users(id),
    to_user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    transaction_reference VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_from_user ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user ON transactions(to_user_id);

-- Create transfer function
CREATE OR REPLACE FUNCTION transfer_money(
    from_user_id UUID,
    to_user_id UUID,
    transfer_amount DECIMAL(12,2)
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    from_balance DECIMAL(12,2);
    transaction_ref TEXT;
BEGIN
    transaction_ref := 'TXN' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    SELECT balance INTO from_balance 
    FROM accounts 
    WHERE user_id = from_user_id;
    
    IF from_balance IS NULL THEN
        RAISE EXCEPTION 'Sender account not found';
    END IF;
    
    IF from_balance < transfer_amount THEN
        RAISE EXCEPTION 'Insufficient balance';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM accounts WHERE user_id = to_user_id) THEN
        RAISE EXCEPTION 'Recipient account not found';
    END IF;
    
    UPDATE accounts 
    SET balance = balance - transfer_amount,
        updated_at = NOW()
    WHERE user_id = from_user_id;
    
    UPDATE accounts 
    SET balance = balance + transfer_amount,
        updated_at = NOW()
    WHERE user_id = to_user_id;
    
    INSERT INTO transactions (from_user_id, to_user_id, amount, transaction_reference)
    VALUES (from_user_id, to_user_id, transfer_amount, transaction_ref);
    
    RETURN transaction_ref;
END;
$$;
```

### 5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🎯 How to Use

1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Log in with your credentials
3. **View Balance**: See your current wallet balance on the dashboard
4. **Search Users**: Use the search bar to find other users
5. **Send Money**: Click "Send Money" next to any user and enter the amount
6. **Track Transfers**: All transactions are recorded with unique transaction IDs

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Appbar.jsx
│   ├── Balance.jsx
│   ├── Button.jsx
│   ├── SearchUsers.jsx
│   └── ...
├── pages/              # Main application pages
│   ├── Dashboard.jsx
│   ├── Signin.jsx
│   ├── Signup.jsx
│   └── SendMoney.jsx
├── services/           # API and business logic
│   ├── apiService.js
│   ├── authService.js
│   └── walletService.js
├── lib/               # External service configurations
│   └── supabase.js
├── config/            # App configuration
│   └── api.js
└── store/             # State management
    └── atoms.js
```

## 🔒 Security Features

- **Password Hashing**: Passwords are securely hashed using SHA-256
- **Input Validation**: All user inputs are validated on both client and server
- **SQL Injection Protection**: Using Supabase's built-in protection
- **Atomic Transactions**: Money transfers are atomic to prevent data inconsistency
- **Balance Validation**: Prevents negative balances and invalid transfers

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```
VITE_PUBLIC_SUPABASE_URL=your_production_supabase_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [React](https://reactjs.org) for the powerful UI library
- [Vite](https://vitejs.dev) for the lightning-fast build tool



---

**Made with ❤️ by Tushar saini**
```

This comprehensive README includes:

✅ **Project overview** with features and tech stack  
✅ **All your screenshots** embedded properly  
✅ **Complete installation guide** with Supabase setup  
✅ **Database schema** and SQL commands  
✅ **Usage instructions** for end users  
✅ **Project structure** explanation  
✅ **Security features** highlighting  
✅ **Deployment instructions** for Vercel  
✅ **Contributing guidelines**  

The README is professional, detailed, and will help anyone understand and set up your payments app!

