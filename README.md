<div align="center">

# 🌿 EcoTrack
**Corporate Carbon Emissions Tracking & Sustainability Intelligence Platform**

*Measure. Track. Reduce. Repeat.*

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express_4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[🐛 Report a Bug](https://github.com/Ankitj2024/EcoTrack-Summer-Term-/issues) · [✨ Request a Feature](https://github.com/Ankitj2024/EcoTrack-Summer-Term-/issues) · [📖 View Docs](#api-reference)

</div>

---

## 🌍 Overview

**EcoTrack** is a modern, full-stack enterprise platform designed to empower corporations to **measure, monitor, and intelligently reduce their carbon footprint**.

By providing a clean, intuitive dashboard, EcoTrack simplifies the complex process of logging raw emission data, automatically converting it to standard CO₂e metrics, and generating comprehensive, regulatory-ready sustainability reports. 

> **Sustainability is no longer a buzzword; it's a data-driven imperative.**

![Dashboard Preview](./Dashboard%20preview.png)

---

## ✨ Key Features

| | Feature | Description |
|---|---|---|
| 🏭 | **Carbon Log Management** | Streamlined interface for inline editing, auto-conversion, and full CRUD operations on emission entries. |
| 🧮 | **Automated CO₂e Conversion** | Incorporates 100+ built-in emission factors to seamlessly auto-convert various units into standardized CO₂e. |
| 📊 | **Interactive Analytics** | Deep insights powered by Recharts, offering trend analysis, departmental breakdowns, and dynamic KPI tracking. |
| 📄 | **Exportable Reports** | Instantly generate professional, structured PDF and Excel sustainability reports (powered by ExcelJS). |
| 🏢 | **Multi-Tenant RBAC** | Robust 5-tier Role-Based Access Control (RBAC) securely enforced across both frontend and backend layers. |
| 🔐 | **Enterprise Security** | JWT-based authentication, bcrypt password hashing, and secure password recovery flows. |
| 🌙 | **Dynamic Theming** | Elegant Dark/Light mode engine providing a premium, synchronized experience across all views. |
| ⚡ | **Zero-Setup Dev Mode** | Seamless local development using `mongodb-memory-server`—no local database installation required! |

---

## 📚 Engineering Resources

We believe in meticulous planning and robust architecture. Explore our core engineering documents:

- 📐 **[Database Design & Schema Diagram](./EcoTrack_Database_Design.pdf)**
- 🏗️ **[Engineering Blueprint & Architecture](./EcoTrack_Engineering_Blueprint.docx)**
- 🔐 **[Authentication & User Management Documentation](./Auth_Documentation.md)**

---

## 🛠️ Technology Stack

<details>
<summary><strong>Frontend (Client)</strong></summary>

- **Core**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4, Lucide Icons
- **Routing & State**: React Router v7
- **Visualization & Motion**: Recharts, Framer Motion
- **Networking**: Axios

</details>

<details>
<summary><strong>Backend (Server)</strong></summary>

- **Core**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Utilities**: Multer (uploads), csv-parser, exceljs (reports)
- **Development**: tsx, mongodb-memory-server (in-memory dev DB)

</details>

---

## 🏗️ Project Architecture

```text
EcoTrack/
├── 📄 server.ts                    # Application Entry (Express + Vite setup)
├── 📄 vite.config.ts               # Frontend Build Config
├── 📁 server/                      # ── BACKEND ──
│   ├── controllers/                # Business Logic (Auth, Logs, Analytics)
│   ├── middleware/                 # JWT & RBAC Guards
│   ├── models/                     # Mongoose Schemas (User, Company, EmissionLog)
│   ├── routes/                     # API Route Definitions
│   └── utils/                      # Shared Helpers & Emission Factors
└── 📁 src/                         # ── FRONTEND ──
    ├── components/                 # Reusable UI & Dashboard Widgets
    ├── pages/                      # Application Views (Dashboard, Auth, Analytics)
    ├── api/                        # Axios Service Modules
    └── context/                    # React Context (Auth, Theme)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- *Optional: Local MongoDB instance (The app uses an in-memory DB by default)*

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankitj2024/EcoTrack-Summer-Term-.git
   cd EcoTrack-Summer-Term-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to include your `JWT_SECRET`. Leave `MONGO_URI` blank to use the in-memory demo database!*

4. **Start the Application**
   ```bash
   npm run dev
   ```
   *The application will be running at [http://localhost:3000](http://localhost:3000).*

---

## 🔑 Demo Access (Zero-Setup)

If you run the app without a `MONGO_URI`, it automatically provisions demo data. You can log in with:

- **Admin**: `admin@ecotrack.com` | `Password123!`
- **Executive**: `exec@ecotrack.com` | `Password123!`
- **Employee**: `employee@ecotrack.com` | `Password123!`

---

## 📡 Core API Reference

The API is served at `http://localhost:3000/api`. Ensure you pass the `Authorization: Bearer <token>` header for protected routes.

- **`POST /api/auth/login`** - Authenticate user & receive JWT
- **`GET /api/users`** - Manage user profiles and roles
- **`GET /api/logs`** - Fetch emission logs (Supports filtering)
- **`POST /api/logs`** - Create a new carbon emission entry
- **`GET /api/analytics/summary`** - Retrieve CO₂e KPIs and summary data
- **`GET /api/analytics/trends`** - Retrieve monthly/yearly emission trend data

---

## 🤝 Contributing

We welcome contributions! To get started:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

<div align="center">

**Built with 💚 by [Ankit Kumar](https://github.com/Ankitj2024)**

*Code, Create, and Conserve. 🌍*

</div>
