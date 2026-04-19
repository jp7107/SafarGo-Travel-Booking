# ✈️ Safar — Travel Planning Platform

A full-stack travel planning platform built with React, Express.js, and MongoDB Atlas. Features Google OAuth authentication, admin dashboard, destination explorer, and trip planning.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router v7, Swiper |
| **Backend** | Express.js 5, Passport.js, JWT |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | Google OAuth 2.0 |
| **Styling** | Vanilla CSS with custom design system |

## 📁 Project Structure

```
Safar/
├── frontend/          # React + Vite client
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context (Auth)
│   │   ├── data/         # Static destination data
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   └── styles/       # Design system CSS
│   └── public/           # Static assets & images
│
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── config/       # DB, Passport, env validation
│   │   ├── middleware/   # Auth, admin, error handler
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API route handlers
│   │   └── utils/        # Email, seed helpers
│   └── server.js         # Entry point
│
├── .env.example       # Environment template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (connection URI provided)
- Google Cloud Console project with OAuth configured

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` values into:
- `backend/.env`
- `frontend/.env`

### 3. Seed Admin User

```bash
cd backend
npm run seed
```

This creates an admin account:
- **Email:** admin@safar.com
- **Password:** Admin@123

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

### 5. Open in Browser

- **App:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/login
- **API Health:** http://localhost:5000/api/health

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Add **Authorized redirect URI:** `http://localhost:5000/api/auth/google/callback`
4. Add your Client ID and Secret to `backend/.env`

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Health check |
| GET | `/api/auth/google` | ❌ | Start Google OAuth |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/trips` | ❌ | Submit trip request |
| GET | `/api/trips` | ✅ | Get user's trips |
| POST | `/api/bookings` | ✅ | Create booking |
| GET | `/api/bookings/my` | ✅ | Get user's bookings |
| GET | `/api/users/profile` | ✅ | Get profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| POST | `/api/admin/login` | ❌ | Admin login |
| GET | `/api/admin/dashboard` | 🛡️ | Dashboard stats |
| GET | `/api/admin/users` | 🛡️ | List users |
| GET | `/api/admin/trips` | 🛡️ | List trips |
| PUT | `/api/admin/trips/:id/status` | 🛡️ | Approve/reject trip |
| GET | `/api/admin/bookings` | 🛡️ | List bookings |

## 🎨 Features

- **Google OAuth** — Secure sign-in with persistent JWT sessions
- **Destination Explorer** — 12+ Indian destinations with real photos
- **Trip Planning** — Custom trip forms with email confirmations
- **Weather Integration** — Real-time weather for each destination
- **Admin Dashboard** — Stats, user management, trip approval workflow
- **Responsive Design** — Mobile-first with glassmorphism UI
- **Dark Theme** — Premium dark color scheme throughout

## 📄 License

MIT
