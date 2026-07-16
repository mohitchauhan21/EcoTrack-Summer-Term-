# EcoTrack — Corporate Carbon Emissions Tracking Platform

> **Version**: 2.0.0  
> **Last Updated**: 2026-07-16  
> **Stack**: React 19 · TypeScript · Express 4 · MongoDB · Vite · TailwindCSS 4 · Recharts · JWT · bcryptjs  

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What's New in v2.0](#whats-new-in-v20)
3. [Architecture](#architecture)
4. [Getting Started](#getting-started)
5. [Demo Credentials](#demo-credentials)
6. [Authentication & RBAC](#authentication--rbac)
7. [Frontend Pages](#frontend-pages)
8. [API Reference](#api-reference)
9. [Technology Stack](#technology-stack)
10. [Design System](#design-system)

---

## Project Overview

EcoTrack is a **corporate sustainability intelligence platform** that helps organizations measure, track, and reduce their carbon footprint. It provides data ingestion, automated CO2e conversion, interactive dashboards, multi-role access control, and AI-powered insights — all in one unified platform.

### Core Capabilities

- **Carbon Accounting** — Log and categorize emission sources (electricity, fuel, water, waste, refrigerant leaks)
- **Automated CO2e Conversion** — 100+ built-in conversion factors with auto-calculation
- **Multi-Tenant RBAC** — Superadmin, Admin, Executive, Manager, Viewer roles per company
- **AI-Powered Insights** — Smart recommendations and interactive carbon chat assistant
- **Interactive Dashboards** — Real-time charts, goal tracking, carbon intensity KPIs
- **Regulatory Reports** — Generate and export sustainability reports

---

## What's New in v2.0

| Feature | Description |
|---------|-------------|
| **Eco Insights AI** | AI-powered carbon reduction recommendations + interactive chat assistant |
| **Full Settings Page** | Theme (dark/light/system), accent colors, notification prefs, security settings |
| **Mind-Blowing UI** | Particle systems, floating orbs, orbital rings, glassmorphism, 20+ custom animations |
| **Custom 404 Page** | Animated 404 page with particles and gradient effects |
| **Responsive Sidebar** | Updated navigation with Eco Insights menu item |
| **Auth Security** | Working forgot/reset password flow with JWT tokens |
| **API Protection** | Auth + role-based middleware on all user routes |
| **Zero Bugs** | Comprehensive bug sweep — all imports, types, and routes validated |

---

## Architecture

```
+---------------------------------------------------+
|                     Frontend                       |
|    React 19 · TypeScript · Vite · TailwindCSS 4   |
|    Recharts · Lucide Icons · React Router v7      |
+--------------------------+------------------------+
                           | HTTP (Axios)
+--------------------------v------------------------+
|                Express REST API                    |
|    JWT Auth · bcryptjs · RBAC Middleware          |
+--------------------------+------------------------+
                           |
+--------------------------v------------------------+
|                MongoDB (Mongoose)                  |
|    Users · Companies · Departments · CarbonLogs   |
+---------------------------------------------------+
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local or Atlas)
- **npm** >= 9.x

### Installation

```bash
git clone https://github.com/mohitchauhan21/EcoTrack-Summer-Term-.git
cd EcoTrack-Summer-Term-
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecotrack
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Run the App

```bash
npm run dev
```

- **Frontend** -> http://localhost:5173
- **API** -> http://localhost:5000

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Superadmin | superadmin@ecotrack.com | password123 |
| Admin | admin@ecotrack.com | password123 |
| Executive | executive@ecotrack.com | password123 |
| Manager | manager@ecotrack.com | password123 |

---

## Authentication & RBAC

### Roles

| Role | Permissions |
|------|-------------|
| **superadmin** | Full system access, manage companies, all CRUD |
| **admin** | Company-level admin, manage users & carbon logs |
| **executive** | View dashboards, reports, AI insights |
| **manager** | Log carbon data, view own department |
| **viewer** | Read-only dashboard access |

### Auth Flow

1. User logs in -> JWT token issued (24h expiry)
2. Token stored in localStorage
3. `requireAuth` middleware validates token on every request
4. `requireRole([...])` middleware enforces role-based access
5. Password reset via email link with JWT reset token (1h expiry)

---

## Frontend Pages

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Landing | / | Public | Animated landing with particles, orbs, scroll-reveals |
| Login | /login | Public | JWT authentication form |
| Register | /register | Public | Company registration |
| Forgot Password | /forgot-password | Public | Email-based password reset |
| Dashboard | /dashboard | Auth | Carbon metrics, charts, KPIs |
| Company Profile | /dashboard/company | Auth | Company details & settings |
| Departments | /dashboard/departments | Auth | Department management |
| Carbon Logs | /dashboard/logs | Auth | Emission data entry & tracking |
| Reports | /dashboard/reports | Auth | Sustainability report generation |
| Users | /dashboard/users | Admin+ | User management & roles |
| Eco Insights | /dashboard/insights | Auth | AI recommendations + chat |
| Settings | /dashboard/settings | Auth | Theme, notifications, security |

---

## API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login | Login with email + password | No |
| POST | /api/auth/register | Register new company | No |
| POST | /api/auth/forgot-password | Request password reset | No |
| POST | /api/auth/reset-password/:token | Reset password | No |

### User Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/users | List all users | superadmin |
| GET | /api/users/:id | Get user by ID | superadmin |
| POST | /api/users | Create new user | superadmin/admin |
| PUT | /api/users/:id | Update user | superadmin/admin |
| DELETE | /api/users/:id | Delete user | superadmin |

### Carbon Log Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/carbon-logs | List carbon logs | Auth |
| POST | /api/carbon-logs | Create carbon log | Auth |
| PUT | /api/carbon-logs/:id | Update log | Auth |
| DELETE | /api/carbon-logs/:id | Delete log | Admin+ |

### Company Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | /api/companies | List companies | superadmin |
| POST | /api/companies | Create company | superadmin |
| PUT | /api/companies/:id | Update company | superadmin |

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & HMR |
| TailwindCSS 4 | Utility-first styling |
| Recharts | Interactive charts |
| React Router v7 | Client-side routing |
| Lucide React | Icon library |
| Axios | HTTP client |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js / Express 4 | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment config |

---

## Design System

EcoTrack uses a **glassmorphism + dark-first** design language:

- **Glass panels**: backdrop-blur-xl, semi-transparent backgrounds
- **Dark mode**: Deep grays with emerald/accent highlights
- **Animations**: 20+ custom keyframes (float, glow, orbit, breathe, twinkle)
- **Typography**: Clean sans-serif with gradient text headers
- **Particles**: Floating background particles on landing pages
- **Accent colors**: Emerald (primary), blue, purple, cyan, rose

```css
/* Example glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```

---

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | Yes | Server port (default: 5000) |
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | JWT signing secret |
| NODE_ENV | No | development or production |
| CLIENT_URL | No | CORS origin (default: http://localhost:5173) |

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT License. See LICENSE for more information.

---

## Acknowledgments

- **Mohit Chauhan** — Project lead & collaborator
- Built for the Summer Term 2026 capstone