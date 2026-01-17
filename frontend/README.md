# Ingenious Platform – Frontend

## 📌 Overview

This repository contains the **frontend application** for the **Ingenious Platform**, a unified digital public services system built for a hackathon.

The frontend provides:
- A modern landing page
- Authentication (Sign In / Login with sliding animation)
- Role-based dashboards for **Citizen**, **Admin**, and **Provider**

The frontend is designed to work with a **central Core Platform backend** and does **not** directly communicate with individual services.

---

## 🧱 Tech Stack

- **React.js**
- **React Router DOM**
- **Custom CSS (no UI framework)**
- **React Icons**

---



---

### 📝 Sign Up (Create Account)

- User enters:
  - Username
  - Password
  - Role (Citizen / Admin / Provider)
- Optional verification:
  - OTP
  - Email (UI only)
- No backend call (demo only)
- After successful sign-up → user is redirected to **Login panel**

---

### 🔑 Login

- User logs in using demo credentials
- Role is detected automatically
- User is redirected to the corresponding dashboard:
  - `/citizen`
  - `/admin`
  - `/provider`

---

## 🧭 Routing & Navigation

Routing is handled using **React Router**.

| Route | Description |
|-----|------------|
| `/` | Landing Page |
| `/auth?mode=signin` | Sign Up panel |
| `/auth?mode=login` | Login panel |
| `/citizen` | Citizen Dashboard |
| `/admin` | Admin Dashboard |
| `/provider` | Provider Dashboard |

The authentication page uses a **sliding animation** to switch between Sign Up and Login panels.

---

## 👥 Role-Based Dashboards

### 👤 Citizen Dashboard
- Placeholder UI for submitting service requests
- Intended to call the Core Platform API

### 🛠️ Admin Dashboard
- Placeholder UI for monitoring system activity
- Intended for logs and system-level access

### 🏢 Provider Dashboard
- Read-only dashboard
- Intended for service providers

Each dashboard includes a **Logout** option that redirects back to the landing page.

---

## 🔗 Backend Integration (Design)

- Frontend communicates **only with the Core Platform**
- No direct calls to health, agriculture, or city services
- Role-based access is enforced by backend
- Headers-based authentication is expected from backend

> Backend integration is minimal or mocked for demo clarity.

---

## ▶️ Run Locally

### 1️⃣ Install dependencies
```bash
npm install

### 2️⃣ Start development server
npm start

### 3️⃣ Open in browser
http://localhost:3000

## 🗂️ Folder Structure

frontend/
│
├── public/
│ └── index.html
│
├── src/
│ ├── pages/
│ │ ├── LandingPage.js
│ │ ├── AuthPage.js
│ │ ├── CitizenDashboard.js
│ │ ├── AdminDashboard.js
│ │ └── ProviderDashboard.js
│ │
│ ├── styles/
│ │ └── auth.css
│ │
│ ├── App.js
│ └── index.js
│
├── .gitignore
├── package.json
└── README.md

🏁 Summary

The Ingenious Platform frontend demonstrates:

Clean and modern UI

Role-based navigation

Scalable structure

Clear separation between frontend and backend