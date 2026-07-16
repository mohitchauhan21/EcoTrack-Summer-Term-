<div align="center">

<br/>

```
███████╗ ██████╗ ██████╗ ████████╗██████╗  █████╗  ██████╗██╗  ██╗
██╔════╝██╔════╝██╔═══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝
█████╗  ██║     ██║   ██║   ██║   ██████╔╝███████║██║     █████╔╝ 
██╔══╝  ██║     ██║   ██║   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ 
███████╗╚██████╗╚██████╔╝   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗
╚══════╝ ╚═════╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
```

### 🌿 Corporate Carbon Emissions Tracking & Sustainability Intelligence Platform

**Measure. Track. Reduce. Repeat.**

<br/>

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express_4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

[🐛 Report a Bug](https://github.com/mohitchauhan21/EcoTrack-Summer-Term-/issues) · [✨ Request a Feature](https://github.com/mohitchauhan21/EcoTrack-Summer-Term-/issues) · [📖 View Docs](#api-reference)

</div>

<br/>

---

## 📋 Table of Contents

- [What is EcoTrack?](#-what-is-ecotrack)
- [Features at a Glance](#-features-at-a-glance)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Demo Credentials](#-demo-credentials)
- [Pages & Routes](#-pages--routes)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 What is EcoTrack?

**EcoTrack** is a full-stack web platform built to help corporations **measure, monitor, and reduce their carbon footprint** — all from one clean, modern dashboard.

From logging raw emission data and auto-converting it to CO₂e, to generating regulatory-ready reports and getting real-time AI recommendations powered by **Google Gemini** — EcoTrack gives sustainability teams everything they need in one place.

> **No fluff. Just data, insights, and action.**

Built with a **React 19** frontend and an **Express + MongoDB** backend, it includes complete JWT authentication, multi-role access control, interactive charts, CSV import/export, in-memory database for zero-setup demos, and a Gemini AI assistant for smart carbon reduction guidance.

---

## ✨ Features at a Glance

| | Feature | What it does |
|---|---|---|
| 🏭 | **Carbon Log Management** | Create, edit, delete emission entries across electricity, fuel, water, waste & refrigerants |
| 🧮 | **Auto CO₂e Conversion** | 100+ built-in emission factors — units auto-converted to CO₂e on entry |
| 📊 | **Interactive Analytics** | Recharts-powered trend graphs, department breakdowns, and KPI cards |
| 🤖 | **Eco Insights AI** | Google Gemini chat assistant for carbon reduction recommendations |
| 📄 | **Exportable Reports** | Generate PDF/Excel sustainability reports (ExcelJS-powered) |
| 🏢 | **Multi-Tenant RBAC** | 5-tier role system: Superadmin → Admin → Executive → Manager → Viewer |
| 🔐 | **Secure Authentication** | JWT tokens, bcrypt hashing, forgot/reset password flow, show/hide password toggle |
| 🌙 | **Theme Engine** | Dark, Light, and System themes with custom accent colors |
| 📱 | **Responsive Layout** | Mobile-first design with collapsible sidebar |
| ⚡ | **Zero-Setup Dev Mode** | `mongodb-memory-server` auto-spins an in-memory DB — no MongoDB install needed |

---

## 🛠️ Tech Stack

<details>
<summary><strong>Frontend</strong></summary>

| Package | Version | Role |
|---|---|---|
| `react` + `react-dom` | ^19.0.1 | UI framework |
| `typescript` | ~5.8.2 | Type safety |
| `vite` | ^6.2.3 | Dev server & bundler |
| `tailwindcss` | ^4.1.14 | Utility-first CSS |
| `react-router-dom` | ^7.18.1 | Client-side routing |
| `recharts` | ^3.9.2 | Charts & data visualization |
| `lucide-react` | ^0.546.0 | Icon library |
| `motion` | ^12.23.24 | Animations |
| `axios` | ^1.18.1 | HTTP client |
| `date-fns` | ^4.4.0 | Date formatting |
| `clsx` + `tailwind-merge` | latest | Conditional class merging |

</details>

<details>
<summary><strong>Backend</strong></summary>

| Package | Version | Role |
|---|---|---|
| `express` | ^4.21.2 | REST API server |
| `mongoose` | ^9.7.4 | MongoDB ODM |
| `jsonwebtoken` | ^9.0.3 | JWT auth tokens |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `cors` | ^2.8.6 | Cross-origin requests |
| `dotenv` | ^17.4.2 | Environment config |
| `multer` | ^2.2.0 | File upload handling |
| `csv-parser` | ^3.2.1 | CSV file parsing |
| `exceljs` | ^4.4.0 | Excel report generation |
| `tsx` | ^4.21.0 | TypeScript execution (dev) |
| `esbuild` | ^0.25.0 | Server bundler (prod) |
| `mongodb-memory-server` | ^11.2.0 | In-memory DB for dev/demo |

</details>

<details>
<summary><strong>AI & Cloud</strong></summary>

| Service | Purpose |
|---|---|
| Google Gemini API | AI-powered carbon insights & chat assistant |

</details>

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│  React 19 · TypeScript · Vite · TailwindCSS 4 · Recharts        │
│  React Router v7 · Motion · Lucide Icons · Axios                │
└─────────────────────────────┬────────────────────────────────────┘
                              │  HTTP / REST  (port 3000)
┌─────────────────────────────▼────────────────────────────────────┐
│                       EXPRESS SERVER                             │
│                                                                  │
│   /api/auth          →  authRoutes.ts                           │
│   /api/company       →  companyRoutes.ts                        │
│   /api/departments   →  departmentRoutes.ts                     │
│   /api/logs          →  logRoutes.ts                            │
│   /api/analytics     →  analyticsRoutes.ts                      │
│   /api/users         →  userRoutes.ts                           │
│                                                                  │
│   Middleware: JWT Auth · RBAC · CORS · JSON body parser         │
└─────────────────────────────┬────────────────────────────────────┘
                              │  Mongoose ODM
┌─────────────────────────────▼────────────────────────────────────┐
│                         MONGODB                                  │
│                                                                  │
│   Users · Companies · Departments · EmissionLogs               │
│                                                                  │
│   ⚡ Dev: mongodb-memory-server (auto, no install required)     │
│   🚀 Prod: MongoDB Atlas or self-hosted via MONGO_URI           │
└──────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                    GOOGLE GEMINI API                             │
│         AI insights · Carbon chat assistant · Reports           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
EcoTrack-Summer-Term-/
│
├── 📄 server.ts                    # App entry point — Express + Vite + DB bootstrap
├── 📄 vite.config.ts               # Vite config (React plugin + TailwindCSS)
├── 📄 tsconfig.json                # TypeScript config
├── 📄 package.json                 # Scripts & dependencies
├── 📄 .env.example                 # Environment variable template
│
├── 📁 server/                      # ── BACKEND ──────────────────────────────────
│   ├── controllers/                #   Business logic (auth, logs, analytics...)
│   ├── middleware/                 #   JWT auth guard · Role-based access (RBAC)
│   ├── models/                     #   Mongoose schemas
│   │   ├── User.ts                 #     User accounts & roles
│   │   ├── Company.ts              #     Company/tenant data
│   │   ├── Department.ts           #     Departments within a company
│   │   └── EmissionLog.ts          #     Carbon emission log entries
│   ├── routes/                     #   Express route definitions
│   │   ├── authRoutes.ts
│   │   ├── companyRoutes.ts
│   │   ├── departmentRoutes.ts
│   │   ├── logRoutes.ts
│   │   ├── analyticsRoutes.ts
│   │   └── userRoutes.ts
│   ├── scripts/                    #   Seed script — auto-populates demo data
│   └── utils/                      #   Shared helpers & emission factor constants
│
└── 📁 src/                         # ── FRONTEND ─────────────────────────────────
    ├── App.tsx                     #   Root component & route tree
    ├── main.tsx                    #   React DOM entry
    ├── index.css                   #   Global styles & animations
    │
    ├── api/                        #   Axios API service modules
    ├── components/
    │   ├── dashboard/              #   Dashboard widgets & charts
    │   ├── data/                   #   Data tables & input forms
    │   ├── layout/                 #   Navbar, Sidebar, DashboardLayout
    │   ├── onboarding/             #   Onboarding flow components
    │   └── ui/                     #   Reusable UI primitives
    │
    ├── constants/                  #   Emission factors, categories, config
    ├── context/                    #   AuthContext · ToastContext · FilterContext
    │
    └── pages/
        ├── LandingPage.tsx         #   Public marketing page
        ├── DashboardPage.tsx       #   Main dashboard overview
        ├── ProfilePage.tsx         #   User profile settings
        ├── OnboardingPage.tsx      #   New user onboarding
        ├── NotFoundPage.tsx        #   404 page
        ├── auth/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   └── ForgotPasswordPage.tsx
        ├── dashboard/
        │   ├── CarbonLogsPage.tsx
        │   ├── AnalyticsPage.tsx
        │   ├── ReportsPage.tsx
        │   ├── DepartmentsPage.tsx
        │   ├── CompanyProfilePage.tsx
        │   ├── UsersPage.tsx
        │   └── SettingsPage.tsx
        └── ai/
            └── EcoInsightsPage.tsx
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version | Download |
|---|---|---|
| Node.js | 18.x | [nodejs.org](https://nodejs.org/) |
| npm | 9.x | Included with Node.js |
| MongoDB | 6.x *(optional)* | [mongodb.com](https://www.mongodb.com/try/download/community) |

> **No MongoDB?** No problem — skip it entirely. EcoTrack auto-starts an in-memory MongoDB and seeds it with demo data when `MONGO_URI` is not set.

---

### Installation

```bash
# Clone the repository
git clone https://github.com/mohitchauhan21/EcoTrack-Summer-Term-.git
cd EcoTrack-Summer-Term-

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

---

## 🔧 Environment Variables

Open `.env` and configure the following:

```env
# ─── Required ─────────────────────────────────────────────────────────────────

# Your Google Gemini API key (get one at https://aistudio.google.com)
GEMINI_API_KEY="your-gemini-api-key-here"

# Secret used to sign JWT tokens — use any long random string
JWT_SECRET="replace-with-a-long-random-secret"

# ─── Optional ─────────────────────────────────────────────────────────────────

# MongoDB connection URI
# Leave EMPTY to use the built-in in-memory database (great for development!)
MONGO_URI=""

# The URL this app is served at (used for callbacks and links)
APP_URL="http://localhost:3000"
```

---

### Running the App

```bash
# Start in development mode (frontend + backend served together)
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser. ✅

```bash
# Other commands
npm run build     # Build for production
npm run start     # Run the production build
npm run preview   # Preview the Vite production build locally
npm run lint      # TypeScript type-check (no emit)
npm run clean     # Delete the dist/ folder
```

---

## 🔑 Demo Credentials

When running without `MONGO_URI`, demo data is auto-seeded. Use any of these accounts to explore the platform:

| Role | Email | Password | What you can do |
|---|---|---|---|
| 🔴 **Superadmin** | `superadmin@ecotrack.com` | `password123` | Full access across all companies |
| 🟠 **Admin** | `admin@techcorp.com` | `password123` | Full access within a company |
| 🟡 **Executive** | `exec@techcorp.com` | `password123` | View analytics & reports |
| 🟢 **Manager** | `manager@techcorp.com` | `password123` | Manage team's emission logs |
| 🔵 **Viewer** | `viewer@techcorp.com` | `password123` | Read-only access |

---

## 📄 Pages & Routes

| Page | Route | Access | Description |
|---|---|---|---|
| Landing | `/` | Public | Marketing homepage |
| Login | `/login` | Public | Sign in with JWT |
| Register | `/register` | Public | Create company + account |
| Forgot Password | `/forgot-password` | Public | Password reset flow |
| Dashboard | `/dashboard` | Auth | KPI overview cards |
| Carbon Logs | `/dashboard/logs` | Auth | Log & manage emission entries |
| Analytics | `/dashboard/analytics` | Auth | Charts, trends, comparisons |
| Reports | `/dashboard/reports` | Auth | Export PDF/Excel reports |
| Departments | `/dashboard/departments` | Auth | Manage departments |
| Company Profile | `/dashboard/company` | Admin | Company settings |
| Users | `/dashboard/users` | Admin | Team & role management |
| Eco Insights AI | `/dashboard/eco-insights` | Auth | Gemini AI carbon assistant |
| Settings | `/dashboard/settings` | Auth | Theme, notifications, security |
| Profile | `/profile` | Auth | Personal profile & password |
| 404 | `*` | — | Animated not-found page |

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user and company |
| `POST` | `/login` | Authenticate and get a JWT token |
| `POST` | `/forgot-password` | Send password reset link |
| `POST` | `/reset-password` | Reset password using token |

### 🏢 Company — `/api/company`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ | Get company profile |
| `PUT` | `/` | ✅ Admin | Update company details |

### 🏬 Departments — `/api/departments`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ | List all departments |
| `POST` | `/` | ✅ Admin | Create a department |
| `PUT` | `/:id` | ✅ Admin | Update a department |
| `DELETE` | `/:id` | ✅ Admin | Delete a department |

### 📋 Emission Logs — `/api/logs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ | List emission logs (filterable) |
| `POST` | `/` | ✅ | Create a new emission log |
| `PUT` | `/:id` | ✅ | Update a log entry |
| `DELETE` | `/:id` | ✅ Manager+ | Delete a log entry |
| `POST` | `/import` | ✅ Admin | Bulk import logs via CSV |

### 📊 Analytics — `/api/analytics`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/summary` | ✅ | Total CO₂e, goals, KPIs |
| `GET` | `/trends` | ✅ | Monthly/yearly emission trends |
| `GET` | `/by-department` | ✅ | Breakdown by department |

### 👤 Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ Admin | List all users in company |
| `PUT` | `/:id/role` | ✅ Admin | Change a user's role |
| `DELETE` | `/:id` | ✅ Admin | Remove a user |

> All protected routes require the header: `Authorization: Bearer <your_jwt_token>`

---

## 🔒 Role-Based Access Control

EcoTrack enforces a 5-tier RBAC hierarchy on both the **frontend** (route guards) and **backend** (middleware):

```
┌─────────────────────────────────────────────────────┐
│  🔴  SUPERADMIN   — Cross-company platform admin    │
│        ↓                                            │
│  🟠  ADMIN        — Full access within company      │
│        ↓                                            │
│  🟡  EXECUTIVE    — Read analytics & reports        │
│        ↓                                            │
│  🟢  MANAGER      — Manage department & logs        │
│        ↓                                            │
│  🔵  VIEWER       — Read-only access               │
└─────────────────────────────────────────────────────┘
```

Each role inherits all permissions of the roles below it, in addition to its own.

---

## 🤝 Contributing

All contributions are welcome! Here's how to get involved:

1. **Fork** the repo
2. **Create** a feature branch  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes using [Conventional Commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your fork  
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request against `main`

Please make sure your code passes `npm run lint` before submitting.

---

## 📄 License

This project is licensed under the **Apache 2.0 License**.  
See the [LICENSE](./LICENSE) file for full details.

---

<div align="center">

<br/>

Built with 💚 by [**Mohit Chauhan**](https://github.com/mohitchauhan21) [**Aman Kumar**](https://github.com/aman08-yadav)

*If this project helped you, consider giving it a ⭐ — it means a lot!*

<br/>

</div>
