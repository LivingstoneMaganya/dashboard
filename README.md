# Full-Stack Neon Project Tracker & Auth Dashboard

[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat&logo=vercel)](https://your-dashboard-app.vercel.app)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-green?style=flat&logo=postgresql)](https://neon.tech)
[![Package](https://img.shields.io/badge/npm-%40maganya%2Fcross--cookie-blue?style=flat&logo=npm)](https://www.npmjs.com/package/@maganya/cross-cookie)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A production-grade full-stack project tracking application built with Node.js, Express, EJS, and Neon Serverless PostgreSQL. Features a zero-trust session middleware powered by the [`@maganya/cross-cookie`](https://www.npmjs.com/package/@maganya/cross-cookie) npm library.

---

## 🔗 Quick Links

- 🚀 **Live Demo:** [https://your-dashboard-app.vercel.app](https://your-dashboard-app.vercel.app)
- 📦 **npm Package Used:** [`@maganya/cross-cookie`](https://www.npmjs.com/package/@maganya/cross-cookie)
- 📖 **Technical Walkthrough Article:** [Read the Medium Deep-Dive](https://medium.com)

---

## 🛠️ Architecture & Tech Stack

- **Backend:** Node.js (ES Modules), Express.js
- **Frontend / Templating:** Vanilla JavaScript, Modern CSS3, EJS
- **Database:** Serverless PostgreSQL on [Neon](https://neon.tech)
- **Session Security:** [`@maganya/cross-cookie`](https://www.npmjs.com/package/@maganya/cross-cookie) (Zero-dependency Web Standards cookie parser/serializer)
- **Authentication:** `bcryptjs` for salted password hashing
- **Hosting & Deployment:** Vercel (Serverless Functions)

---

## 🌟 Key Features

- **Zero-Trust Auth Middleware:** Inspects incoming `Cookie` headers using `@maganya/cross-cookie` to verify session state directly against Neon PostgreSQL on every protected route.
- **Hardened Cookie Security:** Issues `HttpOnly`, `SameSite=Strict`, and `Secure` session cookies without requiring heavy legacy middleware dependencies like `cookie-parser`.
- **Serverless Database Queries:** Uses `@neondatabase/serverless` for instant connection-pooling and automated table initialization on startup.
- **Responsive UI:** Clean, modern CSS dashboard for managing projects, status badges, and user session controls.

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- Node.js (>= 18.0.0)
- A free [Neon PostgreSQL](https://neon.tech) account

### 2. Clone & Install Dependencies
```bash
git clone [https://github.com/LivingstoneMaganya/dashboard.git](https://github.com/LivingstoneMaganya/dashboard.git)
cd dashboard
npm install

3. Configure Environment Variables
Create a .env file in the project root:
Code snippet
PORT=3000
DATABASE_URL="postgresql://user:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require"
NODE_ENV=development


4. Run Development Server
Bash
npm run dev
Open http://localhost:3000 in your browser.


📄 License
MIT © Owiny Livingstone Maganya