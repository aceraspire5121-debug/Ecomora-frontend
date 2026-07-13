# 🛒 Ecomora — Frontend

A full-featured e-commerce web app built with React + Vite. Covers the complete shopping flow — browse, search, cart, checkout, order history — plus a dedicated admin panel for managing products, orders, and customers.

**🔗 Live:** https://ecomora-frontend.vercel.app

---

## ✨ Features

**Customer**
- Register / Login / Forgot & Reset Password (JWT auth)
- Browse products with search + pagination
- Add to cart, manage cart
- Checkout → order receipt
- View order history & profile

**Admin**
- Dashboard overview
- Add / Edit / Delete products
- View & manage all orders
- Manage customers

**General**
- Protected routes (auth-gated pages via `ProtectedRoute`)
- Responsive UI with Material UI + Tailwind CSS

## 🧰 Tech Stack

| Layer      | Tech |
|------------|------|
| Framework  | React 19 + Vite |
| Routing    | React Router v7 |
| UI         | MUI (Material UI) + Emotion + Tailwind CSS |
| Forms      | React Hook Form |
| Auth       | JWT (`jwt-decode`) |
| Lint       | ESLint |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- Ecomora backend API running (this is a frontend-only repo — it talks to a separate REST API)

### Setup

```bash
git clone https://github.com/aceraspire5121-debug/Ecomora-frontend.git
cd Ecomora-frontend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000
```

Point this to wherever your backend is running.

### Run Locally

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

## 📂 Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── images/
│   ├── pages/
│   ├── utils/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── theme.js
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── vite.config.js
```
