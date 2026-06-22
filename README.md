# VELOCITY X - Luxury MERN Stack E-Commerce Platform

VELOCITY X Store is a premium e-commerce platform designed with luxury, minimalist design language (Apple-inspired UI, soft shadows, rounded corners, custom glassmorphism) and built on top of a secure, production-grade MERN architecture.

---

## Workspace Layout

- `backend/` - Node/Express Server, Mongoose database models, JWT protection, middlewares, seed scripts, and Stripe/Razorpay integrations.
- `frontend/` - Vite, React 18, Redux Toolkit, Tailwind CSS, Framer Motion, and Recharts.

---

## Quick Start Guide

### 1. Database Setup
1. Spin up a local MongoDB instance or create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Grab your connection string.

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/vibestore
JWT_SECRET=super_secret_session_token_key_here
JWT_REFRESH_SECRET=super_secret_refresh_token_key_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_... (or leave mock default)
RAZORPAY_KEY_ID=rzp_test_... (or leave mock default)
RAZORPAY_KEY_SECRET=rzp_test_... (or leave mock default)
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Install and Run (Backend)
```bash
cd backend
npm install
npm run seed     # Seeds 12 luxury products, categories, reviews, and test users
npm run dev      # Spins up API server on port 5000
```

Seeded credentials for easy testing:
- **Admin**: `admin@vibestore.com` / `admin123`
- **Customer User**: `user@vibestore.com` / `user123`

### 4. Install and Run (Frontend)
```bash
cd ../frontend
npm install
npm run dev      # Runs dev client on http://localhost:5173 (proxied to API port 5000)
```

---

## Production Deployment Guides

### Backend (Render / Railway)
1. Link your GitHub repository.
2. Select **Web Service** on Render or **New Service** on Railway.
3. Configure the environment variables (matching `backend/.env`).
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`

### Frontend (Vercel)
1. Link your GitHub repository to Vercel.
2. Select the `frontend` folder as the root directory of the project.
3. Set the Framework Preset to **Vite**.
4. Configure Environment Variables:
   - `VITE_API_URL`: Set this to your production backend URL (e.g. `https://vibe-store-api.onrender.com`).
5. Run deploy. Vercel compiles using `npm run build` and serves static pages over edge CDNs.
# velocity
# velocity
# velocity1
# velocity
