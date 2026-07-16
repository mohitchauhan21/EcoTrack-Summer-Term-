# EcoTrack — Corporate Carbon Emissions Tracking Platform

> **Version**: 0.1.0
> **Last Updated**: 2026-07-16
> **Stack**: React 19 · TypeScript · Express 4 · MongoDB (in-memory) · Vite · TailwindCSS 4 · Recharts · JWT · bcryptjs

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & How It Works](#architecture--how-it-works)
3. [Directory Structure](#directory-structure)
4. [Technology Stack & Dependencies](#technology-stack--dependencies)
5. [Getting Started](#getting-started)
6. [Database & Data Models](#database--data-models)
7. [Backend API Reference](#backend-api-reference)
8. [Frontend Application](#frontend-application)
9. [Authentication & RBAC](#authentication--rbac)
10. [Routing Map](#routing-map)
11. [Components Reference](#components-reference)
12. [Design System & Styling](#design-system--styling)
13. [Key Behaviors & Gotchas](#key-behaviors--gotchas)
14. [Known Limitations & TODOs](#known-limitations--todos)
15. [CSV Upload Format](#csv-upload-format)

---

## Project Overview

**EcoTrack** is a corporate sustainability intelligence platform that allows organizations to:

- **Ingest** carbon emission data via manual entry or bulk CSV upload.
- **Automatically convert** raw activity data (kWh, miles, kg) into carbon equivalents (tCO2e) using predefined conversion factors.
- **Visualize** emissions via line-trend charts and pie-chart breakdowns by activity type.
- **Filter** all analytics by department and date range.
- **Export** filtered data as Excel (`.xlsx`) reports with a live **Data Preview Table**.
- **Manage** departments, users, and company profile through a role-based admin panel with **Toast Notifications**.
- **Authenticate** securely with real JWT-based login, bcrypt password hashing, and role-scoped API access.
- **Onboard** new companies through a guided registration flow that creates the company and its first admin user in one step.
- **Industry-Grade UX**: Features glassmorphism authentication pages, animated KPI counters, and seamless transitions.

The application is designed for a **Corporate Sustainability Officer** (admin) who manages their company's carbon data, with supporting roles for data-entry employees and read-only executives.

---

## Architecture & How It Works

EcoTrack is a **unified MERN-like monolith** where the Express backend and the Vite/React frontend are served from a single process.

```
+--------------------------------------------------+
|                   server.ts                      |
|  +--------------+    +------------------------+  |
|  |  Express API  |    |  Vite Dev Middleware    |  |
|  |  /api/*       |    |  (SPA, HMR)            |  |
|  +------+-------+    +------------+-----------+  |
|         |                         |              |
|         v                         v              |
|  +--------------+    +------------------------+  |
|  |  Mongoose     |    |  React 19 App          |  |
|  |  Models       |    |  (BrowserRouter)       |  |
|  +------+-------+    +------------------------+  |
|         |                                        |
|         v                                        |
|  +------------------------------------------+    |
|  |  MongoDB (in-memory or MONGO_URI)        |    |
|  +------------------------------------------+    |
+--------------------------------------------------+
```

**How `npm run dev` works:**

1. `tsx server.ts` is executed.
2. `connectDb()` is called:
   - If `process.env.MONGO_URI` is set, it connects to an external MongoDB instance.
   - **Otherwise**, it downloads and starts `mongodb-memory-server` (~660MB binary on first run, cached after), creates an ephemeral in-memory DB, and calls `seedData()` to populate it with mock data (1 company, 4 departments, 400 emission logs, 6 users).
3. Express mounts all API routes under `/api/*`.
4. Vite is launched in **middleware mode** (`middlewareMode: true`) and attached to Express, so the React SPA is served from the same port.
5. The server listens on **`http://0.0.0.0:3000`**.

> **Critical**: On first run, the MongoDB binary download takes several minutes. The server will appear unresponsive until the download completes and `seedData()` finishes. Watch the terminal for `Server running on http://0.0.0.0:3000`.

> **Important**: A valid `JWT_SECRET` environment variable is required for authentication to work. See [Getting Started](#getting-started).

---

## Directory Structure

```
zip/                            # Project root
+-- index.html                  # Vite HTML entry point
+-- server.ts                   # Express + Vite entry (the "main" file)
+-- package.json                # NPM scripts & dependencies
+-- tsconfig.json               # TypeScript config (ES2022, bundler resolution)
+-- vite.config.ts              # Vite config (React plugin, TailwindCSS plugin)
+-- .env.example                # Environment variable template
|
+-- server/                     # Backend code
|   +-- controllers/
|   |   +-- analyticsController.ts    # Summary, trend, by-source, export (companyId-scoped)
|   |   +-- authController.ts         # [NEW] register, login, getMe (JWT-based)
|   |   +-- companyController.ts      # Get/update company (companyId-scoped)
|   |   +-- departmentController.ts   # CRUD departments (companyId-scoped, duplicate name check)
|   |   +-- logController.ts          # CRUD logs, bulk CSV upload (companyId-scoped)
|   |   +-- userController.ts         # CRUD users
|   +-- middleware/
|   |   +-- auth.ts                   # [NEW] requireAuth -- verifies JWT, sets req.user
|   |   +-- requireRole.ts            # [NEW] requireRole(roles[]) -- RBAC guard for routes
|   |   +-- upload.ts                 # Multer config (CSV only, 10MB max)
|   +-- models/
|   |   +-- Company.ts                # { name, region (enum: VALID_REGIONS), createdAt }
|   |   +-- Department.ts             # { companyId, name (trimmed), active }
|   |   +-- EmissionLog.ts            # { companyId, departmentId, date, activityType, rawAmount, rawUnit, carbonEquivalent, source }
|   |   +-- User.ts                   # { name, email, password (hashed, select:false), role, companyId, departmentId, createdAt }
|   +-- routes/
|   |   +-- analyticsRoutes.ts        # All routes protected by requireAuth
|   |   +-- authRoutes.ts             # [NEW] POST /register, POST /login, GET /me
|   |   +-- companyRoutes.ts          # GET protected; POST protected + requireRole(admin/superadmin)
|   |   +-- departmentRoutes.ts       # GET protected; POST/DELETE protected + requireRole(admin/superadmin)
|   |   +-- logRoutes.ts              # All routes protected by requireAuth + canManageLogs
|   |   +-- userRoutes.ts
|   +-- scripts/
|   |   +-- seedMockData.ts           # Seeds 1 company, 4 depts, 400 logs, 6 users (bcrypt passwords)
|   +-- utils/
|       +-- conversionFactors.ts      # CO2e conversion factors & calculator
|
+-- src/                        # Frontend code (React)
    +-- main.tsx                # ReactDOM entry
    +-- index.css               # Global CSS (imports Tailwind)
    +-- App.tsx                 # Router, ProtectedRoute, layout structure
    |
    +-- api/
    |   +-- axiosClient.ts      # Axios instance (baseURL: "/api") + JWT auth interceptor
    |
    +-- constants/
    |   +-- regions.ts          # [NEW] COUNTRIES list -- shared by Register & CompanyProfile pages
    |
    +-- context/
    |   +-- AuthContext.tsx      # Auth state, real login/register/logout, JWT token, localStorage
    |   +-- FilterContext.tsx    # Global filter state (department, date range, preset)
    |   +-- ToastContext.tsx     # Global toast notification provider
    |
    +-- components/
    |   +-- dashboard/
    |   |   +-- EmissionSourcePieChart.tsx   # Recharts pie chart by activity type
    |   |   +-- EmissionTrendChart.tsx       # Recharts line chart of monthly emissions
    |   |   +-- FilterBar.tsx               # Department + date range + preset selector
    |   |   +-- KpiCard.tsx                 # Single KPI display card
    |   |   +-- DepartmentBarChart.tsx      # Recharts bar chart of department emissions
    |   |   +-- RecentActivityFeed.tsx      # Timeline feed of recent logs
    |   +-- data/
    |   |   +-- CsvUploader.tsx             # Drag-and-drop CSV bulk upload (with Toasts)
    |   |   +-- LogsTable.tsx               # Paginated emission logs table
    |   |   +-- ManualEntryForm.tsx         # Single-entry form (with Toasts)
    |   +-- layout/
    |   |   +-- DashboardLayout.tsx         # Sidebar + main content area + mobile menu
    |   |   +-- Footer.tsx                  # Simple footer
    |   |   +-- Navbar.tsx                  # Public pages top navbar
    |   +-- onboarding/
    |       +-- CompanyBoundariesStep.tsx    # Company name/region form
    |       +-- DepartmentTaggingStep.tsx    # Add departments step (connected to real API)
    |
    +-- pages/
        +-- LandingPage.tsx                 # Public marketing/hero page
        +-- DashboardPage.tsx               # Main dashboard (KPIs + charts)
        +-- DataManagementPage.tsx           # Legacy data page (not routed, superseded by CarbonLogsPage)
        +-- OnboardingPage.tsx              # First-time setup wizard (accessible post-registration)
        +-- ProfilePage.tsx                 # User profile display
        +-- auth/
        |   +-- LoginPage.tsx               # Real JWT login (error display, loading state)
        |   +-- RegisterPage.tsx            # Real registration (creates company + admin user)
        |   +-- ForgotPasswordPage.tsx      # Forgot password (UI only)
        +-- dashboard/
            +-- AnalyticsPage.tsx            # Charts + KPIs with filters
            +-- CarbonLogsPage.tsx           # Manual entry + CSV upload + logs table
            +-- CompanyProfilePage.tsx       # View/edit company details (region dropdown)
            +-- DepartmentsPage.tsx          # List/add/delete departments (duplicate-name guard)
            +-- ReportsPage.tsx              # Date range filters + Excel export
            +-- SettingsPage.tsx             # Theme/notification prefs (localStorage)
            +-- UsersPage.tsx               # List/add/delete users
```

---

## Technology Stack & Dependencies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | Server runtime |
| **Language** | TypeScript | ~5.8 | Type safety across frontend & backend |
| **Frontend Framework** | React | 19 | UI components |
| **Bundler** | Vite | 6.2 | Dev server, HMR, build |
| **CSS** | TailwindCSS | 4.1 | Utility-first styling via `@tailwindcss/vite` plugin |
| **Routing** | react-router-dom | 7.18 | Client-side SPA routing |
| **Charts** | Recharts | 3.9 | Line charts, pie charts |
| **HTTP Client** | Axios | 1.18 | Frontend API calls + JWT interceptor |
| **Icons** | lucide-react | 0.546 | SVG icon library |
| **Animation** | Motion (Framer) | 12.23 | Micro-animations (available but lightly used) |
| **Backend** | Express | 4.21 | REST API server |
| **Database** | Mongoose | 9.7 | MongoDB ODM |
| **In-Memory DB** | mongodb-memory-server | 11.2 | Zero-config ephemeral MongoDB for development |
| **File Upload** | Multer | 2.2 | Multipart form handling for CSV |
| **CSV Parsing** | csv-parser | 3.2 | Stream-based CSV parsing |
| **Excel Export** | ExcelJS | 4.4 | Generate `.xlsx` report files |
| **Date Utils** | date-fns | 4.4 | Date formatting in FilterBar |
| **Auth Tokens** | jsonwebtoken | 9.0 | **[NEW]** Sign and verify JWT tokens (7-day expiry) |
| **Password Hashing** | bcryptjs | 3.0 | **[NEW]** Hash and compare user passwords (10 salt rounds) |
| **TS Runner** | tsx | 4.21 | Run TypeScript directly without pre-compilation |

### NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `tsx server.ts` | Start development server (Express + Vite middleware on port 3000) |
| `build` | `vite build && esbuild server.ts ...` | Build production frontend + bundle server |
| `start` | `node dist/server.cjs` | Run production build |
| `lint` | `tsc --noEmit` | Type-check the entire project |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** (comes with Node)
- ~1GB free disk space (for MongoDB binary download on first run)

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and set your JWT secret
cp .env.example .env
# Edit .env and set JWT_SECRET to any long, random string, e.g.:
# JWT_SECRET="my-super-secret-key-change-me-in-production"

# 3. Start development server
npm run dev

# 4. Wait for the terminal to print:
#    "Server running on http://0.0.0.0:3000"
#    (First run downloads ~660MB MongoDB binary -- be patient)

# 5. Open http://localhost:3000 in your browser
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```
# Required: Secret key used to sign and verify JWT tokens.
# Use any long, random string. Never commit the real value.
JWT_SECRET="replace-with-a-long-random-string"

# Optional: Connect to an external MongoDB instead of the in-memory one.
# When set, the seed script is NOT run automatically.
MONGO_URI=mongodb://localhost:27017/ecotrack
```

> **Note**: `JWT_SECRET` is **required**. If it is not set, the `/api/auth/login` and `/api/auth/register` endpoints will return a 500 error.

---

## Database & Data Models

### Company

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String (trimmed) | Yes | -- | Company name |
| `region` | String (enum: `VALID_REGIONS`) | Yes | -- | Must be one of 25 supported countries |
| `createdAt` | Date | -- | `Date.now` | Auto-set |

> **Important**: Each authenticated user is scoped to their own company via the JWT payload. `Company.findOne({ _id: req.user.companyId })` is used everywhere.

> **Validation**: `region` must be one of the 25 values in `VALID_REGIONS` (exported from `server/models/Company.ts`). The frontend `COUNTRIES` list in `src/constants/regions.ts` must be kept in sync with this list.

### Department

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `companyId` | ObjectId (ref: Company) | Yes | -- | Parent company |
| `name` | String (trimmed) | Yes | -- | Department name |
| `active` | Boolean | -- | `true` | Soft-delete flag |

### EmissionLog

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `companyId` | ObjectId (ref: Company) | Yes | -- | Parent company |
| `departmentId` | ObjectId (ref: Department) | Yes | -- | Owning department |
| `date` | Date | Yes | -- | Date of the activity |
| `activityType` | String (enum) | Yes | -- | `"Travel"`, `"Utilities"`, `"Supply Chain"`, or `"Other"` |
| `rawAmount` | Number | Yes | -- | Raw numeric value of the activity |
| `rawUnit` | String | Yes | -- | Unit of the raw amount (e.g., `"miles"`, `"kWh"`, `"kg"`) |
| `carbonEquivalent` | Number | Yes | -- | Computed tCO2e value |
| `source` | String | -- | -- | Description or origin of the data |
| `createdAt` | Date | -- | `Date.now` | Auto-set |

### User

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | Yes | -- | Full name |
| `email` | String | Yes (unique) | -- | Stored lowercase + trimmed |
| `password` | String | Yes | -- | bcrypt hash; excluded from queries by default (`select: false`) |
| `role` | String (enum) | Yes | -- | `"superadmin"`, `"admin"`, `"employee"`, `"executive"` |
| `companyId` | ObjectId (ref: Company) | Yes | -- | Parent company |
| `departmentId` | ObjectId (ref: Department) | -- | -- | Optional department assignment |
| `createdAt` | Date | -- | `Date.now` | Auto-set |

### Carbon Conversion Factors

Defined in `server/utils/conversionFactors.ts`:

| Activity Type | Unit | Factor (kg CO2e per unit) |
|---------------|------|---------------------------|
| Utilities | kWh | 0.475 |
| Travel | miles | 0.254 |
| Supply Chain | kg | 2.1 |
| Other | unit | 1.0 |

The `calculateCarbonEquivalent(activityType, unit, rawAmount)` function returns the value in **tonnes** (divides by 1000).

### Seed Data

On startup (in-memory mode), `seedMockData.ts` creates:
- **1 Company**: "Acme Corporation", region `"India"`
- **4 Departments**: HR, Sales, Manufacturing, Logistics
- **400 Emission Logs**: Random data spanning the past 12 months, skewed so ~50% come from Logistics.
- **6 Users** (all with password `Password123!`):

| Name | Email | Role |
|------|-------|------|
| Super Admin | `superadmin@ecotrack.com` | superadmin |
| Company Admin | `admin@ecotrack.com` | admin |
| Executive Viewer | `exec@ecotrack.com` | executive |
| John Employee | `employee@ecotrack.com` | employee (HR) |
| Jane Logistics | `jane@ecotrack.com` | employee (Logistics) |
| Alice Mfg | `alice@ecotrack.com` | employee (Manufacturing) |

---

## Backend API Reference

Base URL: `/api`

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Returns `{ status: "ok" }` |

### Auth (`/api/auth`) -- New

All auth endpoints are **public** (no token required).

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| `POST` | `/api/auth/register` | Create a new company + first admin user | `{ name, email, password, companyName, region }` |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT | `{ email, password }` |
| `GET` | `/api/auth/me` | Restore session from stored token | Requires `Authorization: Bearer <token>` header |

**`/register` and `/login` response shape:**
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "...", "email": "...", "role": "...", "departmentId": "..." },
  "companyName": "..."
}
```

JWT payload: `{ id, role, companyId }`, expires in **7 days**.

### Company (`/api/company`) -- Protected

All routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description | Request Body |
|--------|----------|------|-------------|-------------|
| `GET` | `/api/company` | requireAuth | Get the company for the logged-in user | -- |
| `POST` | `/api/company` | requireAuth + admin/superadmin | Update company details | `{ name: string, region: string }` |

### Departments (`/api/departments`) -- Protected

| Method | Endpoint | Auth | Description | Request Body |
|--------|----------|------|-------------|-------------|
| `GET` | `/api/departments` | requireAuth | List all active departments for user's company | -- |
| `POST` | `/api/departments` | requireAuth + admin/superadmin | Create a department (duplicate name check) | `{ name: string }` |
| `DELETE` | `/api/departments/:id` | requireAuth + admin/superadmin | Soft-delete (sets `active: false`) | -- |

### Emission Logs (`/api/logs`) -- Protected

All routes require `requireAuth` + `canManageLogs` (superadmin, admin, employee).

| Method | Endpoint | Description | Request Body / Query |
|--------|----------|-------------|---------------------|
| `GET` | `/api/logs` | List logs for user's company (paginated) | `?page=1&limit=10&departmentId=...&startDate=...&endDate=...` |
| `POST` | `/api/logs` | Create a single log | `{ departmentId, date, activityType, rawAmount, rawUnit, source }` |
| `PUT` | `/api/logs/:id` | Update a log (recalculates CO2e; scoped to company) | Partial body with fields to update |
| `DELETE` | `/api/logs/:id` | Delete a log (scoped to company) | -- |
| `POST` | `/api/logs/bulk-upload` | Bulk upload via CSV | `multipart/form-data` with field `file` |

### Analytics (`/api/analytics`) -- Protected

All routes require `requireAuth`. Data is automatically scoped to `req.user.companyId`.

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|-------------|
| `GET` | `/api/analytics/summary` | KPI data (total emissions, top dept, MoM change) | `?departmentId=...&startDate=...&endDate=...` |
| `GET` | `/api/analytics/trend` | Monthly emission trend data | Same as above |
| `GET` | `/api/analytics/by-source` | Emissions grouped by activity type | Same as above |
| `GET` | `/api/analytics/by-department` | Emissions grouped by department | Same as above |
| `GET` | `/api/analytics/export` | Download `.xlsx` spreadsheet of filtered data | Same as above |

### Users (`/api/users`)

| Method | Endpoint | Description | Request Body / Query |
|--------|----------|-------------|---------------------|
| `GET` | `/api/users` | List users for a company | `?companyId=...` (required) |
| `POST` | `/api/users` | Create a user | `{ name, email, role, companyId, departmentId? }` |
| `DELETE` | `/api/users/:id` | Delete a user | -- |

---

## Frontend Application

### Entry Flow

```
index.html -> src/main.tsx -> <App />
                                |
                    +-----------+-----------+
                    |   AuthProvider         |
                    |   FilterProvider       |
                    |   BrowserRouter        |
                    |                        |
                    | +- Public Routes ----+ |
                    | |  / -> LandingPage  | |
                    | |  /login            | |
                    | |  /register         | |
                    | |  /forgot-password  | |
                    | +--------------------+ |
                    |                        |
                    | +- Protected Routes -+ |
                    | |  /onboarding       | |
                    | |  /dashboard/*      | |
                    | |  (DashboardLayout) | |
                    | +--------------------+ |
                    +------------------------+
```

### Context Providers

1. **`AuthProvider`** (wraps entire app)
   - State: `isAuthenticated`, `companyName`, `role`, `userName`, `departmentId`, `token`
   - Persisted to `localStorage` under key `"auth"`
   - `login(email, password)` -- POSTs to `/api/auth/login`, stores JWT
   - `register(data)` -- POSTs to `/api/auth/register`, stores JWT
   - `logout()` -- clears state and localStorage
   - `isLoading` -- true until the stored session has been restored from localStorage (prevents premature redirect to `/login` on hard refresh)
   - Type `Role = "superadmin" | "admin" | "employee" | "executive"`

2. **`FilterProvider`** (wraps entire app)
   - State: `departmentId`, `startDate`, `endDate`, `preset`
   - Used by dashboard charts and analytics pages to filter data
   - Not persisted

### API Client

`src/api/axiosClient.ts` exports a pre-configured Axios instance:
- `baseURL: "/api"` -- works because Vite middleware runs on the same Express server
- **JWT interceptor**: On every request, reads `token` from `localStorage["auth"]` and injects `Authorization: Bearer <token>` header automatically.

---

## Authentication & RBAC

### Current Implementation (Real JWT Auth)

Authentication is now **fully implemented** with:

- **Registration** (`POST /api/auth/register`): Creates a new company and its first admin user. Password is hashed with bcrypt (10 rounds). Returns a signed JWT.
- **Login** (`POST /api/auth/login`): Validates email + bcrypt password comparison. Returns a signed JWT.
- **Session Restore** (`GET /api/auth/me`): Allows the frontend to restore user details after a hard refresh using the stored JWT, without re-entering credentials.
- **Token Storage**: The JWT is stored in `localStorage["auth"]` and automatically attached to every API request by the Axios interceptor.
- **Backend Guards**: All API routes (except `/api/auth/*` and `/api/health`) are protected by `requireAuth` middleware. Role-sensitive routes additionally use `requireRole`.

### Demo Credentials

All seeded users share the password **`Password123!`**.

| Role | Email |
|------|-------|
| Admin | `admin@ecotrack.com` |
| Employee | `employee@ecotrack.com` |
| Executive | `exec@ecotrack.com` |
| Super Admin | `superadmin@ecotrack.com` |

### RBAC Matrix

| Page / Feature | superadmin | admin | employee | executive |
|----------------|:----------:|:-----:|:--------:|:---------:|
| Dashboard | Yes | Yes | Yes (limited) | Yes |
| Company Profile | Yes (edit) | Yes (edit) | No | No |
| Departments | Yes (manage) | Yes (manage) | No | No |
| Carbon Logs | Yes | Yes (+ CSV upload) | Yes (manual only) | No |
| Analytics | Yes | Yes | No | Yes (view only) |
| Reports / Export | Yes | Yes | No | Yes (view only) |
| Users | Yes (manage) | Yes (manage) | No | No |
| Settings | Yes | Yes | No | No |
| Profile | Yes | Yes | Yes | Yes |

### Backend Route Guards

| Middleware | Effect |
|-----------|--------|
| `requireAuth` | Verifies `Authorization: Bearer <token>`. Sets `req.user = { id, role, companyId }`. Returns 401 if missing or invalid. |
| `requireRole(roles[])` | Returns 403 if `req.user.role` is not in the allowed list. Must be used after `requireAuth`. |

### ProtectedRoute Component

```tsx
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
}
```

The sidebar (`DashboardLayout.tsx`) also filters navigation items by role so users only see links they have access to.

---

## Routing Map

### Public Routes (with Navbar)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Marketing hero page |
| `/login` | `LoginPage` | Real JWT sign-in form (with error display + loading state) |
| `/register` | `RegisterPage` | Registration form -- creates a new company + admin user |
| `/forgot-password` | `ForgotPasswordPage` | Password reset form (UI only) |

### Protected Routes (authentication required)

| Path | Component | Allowed Roles |
|------|-----------|---------------|
| `/onboarding` | `OnboardingPage` | All authenticated (post-registration wizard) |
| `/dashboard` | `DashboardPage` | All |
| `/dashboard/profile` | `ProfilePage` | All |
| `/dashboard/company` | `CompanyProfilePage` | superadmin, admin |
| `/dashboard/departments` | `DepartmentsPage` | superadmin, admin |
| `/dashboard/logs` | `CarbonLogsPage` | superadmin, admin, employee |
| `/dashboard/analytics` | `AnalyticsPage` | superadmin, admin, executive |
| `/dashboard/reports` | `ReportsPage` | superadmin, admin, executive |
| `/dashboard/users` | `UsersPage` | superadmin, admin |
| `/dashboard/settings` | `SettingsPage` | superadmin, admin |

### Catch-All

`/*` -> Redirects to `/dashboard`

---

## Components Reference

### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `src/components/layout/Navbar.tsx` | Top navigation for public pages. Shows "EcoTrack" brand + Login/Register links. |
| `DashboardLayout` | `src/components/layout/DashboardLayout.tsx` | Sidebar + main content container. Handles role-filtered nav, mobile hamburger menu, logout. Uses `<Outlet />` for nested routes. |
| `Footer` | `src/components/layout/Footer.tsx` | Simple footer used on landing page. |

### Dashboard Components

| Component | File | Description |
|-----------|------|-------------|
| `KpiCard` | `src/components/dashboard/KpiCard.tsx` | Displays a single metric (title, value, subtitle, optional trend indicator). Shows loading shimmer. |
| `FilterBar` | `src/components/dashboard/FilterBar.tsx` | Department dropdown + date pickers + preset buttons (Last 7 Days, Last 30 Days, Last 90 Days, YTD, All Time). Updates `FilterContext`. |
| `EmissionTrendChart` | `src/components/dashboard/EmissionTrendChart.tsx` | Recharts `LineChart` showing monthly tCO2e over time. Fetches from `/api/analytics/trend`. |
| `EmissionSourcePieChart` | `src/components/dashboard/EmissionSourcePieChart.tsx` | Recharts `PieChart` showing breakdown by activity type. Fetches from `/api/analytics/by-source`. |

### Data Components

| Component | File | Description |
|-----------|------|-------------|
| `ManualEntryForm` | `src/components/data/ManualEntryForm.tsx` | Form to create a single emission log. Fields: department, date, activity type, raw amount, unit. Auto-calculates CO2e preview. Employee role gets fixed department. |
| `CsvUploader` | `src/components/data/CsvUploader.tsx` | Drag-and-drop CSV upload zone. Posts to `/api/logs/bulk-upload`. Shows inserted count and row-level errors. |
| `LogsTable` | `src/components/data/LogsTable.tsx` | Paginated table of emission logs. Shows date, department, activity, amount, CO2e. Has delete buttons (admin only). Respects `FilterContext`. |

### Onboarding Components

| Component | File | Description |
|-----------|------|-------------|
| `CompanyBoundariesStep` | `src/components/onboarding/CompanyBoundariesStep.tsx` | Step 1 of first-time setup: enter company name and region. |
| `DepartmentTaggingStep` | `src/components/onboarding/DepartmentTaggingStep.tsx` | Step 2: add department tags to the company (connected to real `/api/departments` endpoint). |

---

## Design System & Styling

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background (primary) | `#050505` | Page background |
| Background (surface) | `#0f0f0f` | Cards, forms |
| Background (sidebar) | `#0a0a0a` | DashboardLayout sidebar |
| Border | `white/5` or `white/10` | Subtle borders |
| Text (primary) | `zinc-100` | Headings, body |
| Text (secondary) | `zinc-400` / `zinc-500` | Descriptions, labels |
| Accent (primary) | `emerald-500` (`#10b981`) | Buttons, active states, icons |
| Accent (hover) | `emerald-400` | Button hover |
| Destructive | `red-400` / `red-500` | Delete actions, error messages |

### Typography Conventions

- **Page headings**: `text-3xl font-light text-zinc-100`
- **Subtitles**: `text-zinc-500 text-sm`
- **Labels**: `text-[10px] uppercase tracking-widest font-bold text-zinc-500`
- **Body text**: `text-sm text-zinc-300`

### Form Input Style

```
bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100
focus:outline-none focus:border-emerald-500/50 transition-colors
```

### Button Style (Primary)

```
bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-lg
font-bold uppercase tracking-wide transition-colors text-sm
disabled:bg-zinc-800 disabled:text-zinc-500
```

### Error Alert Style

```
text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3
```

---

## Key Behaviors & Gotchas

### 1. First-Run MongoDB Download

`mongodb-memory-server` downloads a ~660MB MongoDB binary the first time `npm run dev` is run. This is cached in `~/.cache/mongodb-binaries/` afterward. The server will not respond to HTTP requests until this finishes.

### 2. Single-Port Architecture

Both the API and the frontend are served from **port 3000**. The Vite dev server runs as Express middleware, NOT as a separate process. This means:
- `http://localhost:3000` serves the React SPA
- `http://localhost:3000/api/*` serves the REST API
- There is no separate port 5173 (Vite's default standalone port is not used)

### 3. JWT_SECRET is Required

The server will start, but login/register will return HTTP 500 if `JWT_SECRET` is not set. Always copy `.env.example` to `.env` and fill in a secret before running.

### 4. Company Scoping

All API data (logs, departments, analytics) is now automatically scoped to `req.user.companyId` extracted from the JWT. Users cannot see or modify another company's data. `Company.findOne()` without a filter is no longer used -- queries are always filtered by `companyId`.

### 5. Soft-Delete for Departments

`deleteDepartment` sets `active: false` rather than actually removing the document. `getDepartments` filters for `active: true`.

### 6. Duplicate Department Names

`createDepartment` now validates that a department with the same name (case-insensitive) does not already exist within the same company before inserting.

### 7. Password is Hidden by Default

The `User` model's `password` field has `select: false`. This means it is **never** returned in queries unless you explicitly call `.select("+password")`. Only `authController.ts -> login()` does this.

### 8. DataManagementPage is Legacy

`src/pages/DataManagementPage.tsx` still exists but is **not routed** in `App.tsx`. Its functionality has been moved to `src/pages/dashboard/CarbonLogsPage.tsx`. It can be safely deleted.

### 9. Settings are Client-Only

The Settings page saves preferences to `localStorage` under key `"ecotrack_settings"`. There is no backend persistence for settings. The theme toggle is present but does not actually change the app theme (the app is always dark mode).

### 10. Export Format

The Reports page's "Generate CSV Report" button actually downloads an **Excel `.xlsx` file** (via ExcelJS), not a CSV. The file is generated server-side at `/api/analytics/export`.

### 11. Onboarding Flow

After a successful `/register` call, the user is automatically redirected to `/onboarding`. The onboarding wizard (company name/region + department setup) is now accessible and connected to the real API.

---

## Known Limitations & TODOs

### Missing Features

- [ ] **Forgot Password**: The page exists as UI only. No backend endpoint.
- [ ] **Theme Toggle**: Settings page has a theme selector but it doesn't actually apply light mode.
- [ ] **Real-time Updates**: No WebSocket or SSE for live data updates.
- [ ] **Test Suite**: No unit or integration tests exist.
- [ ] **User Management Password Hashing**: The Users admin panel does not hash passwords when creating new users. Only the seed script and `/api/auth/register` properly hash passwords via bcrypt.

### Known Bugs

- The `ProfilePage` reads `userName` from auth state but still hardcodes the email as `client@ecotrack.com` instead of reading it from auth state.
- The `LandingPage` "Get Started" button links to `/auth` which doesn't exist -- it should link to `/login`.

### Previously Fixed (PR #1)

- Authentication is now real JWT-based -- no more mock role-guessing from email keywords.
- Registration backend is fully implemented -- creates company + admin user in one step.
- All protected API routes now enforce `requireAuth`.
- All data queries are scoped to the authenticated user's `companyId`.
- Duplicate department name validation added.
- Seed data now creates 6 users with properly hashed passwords (`Password123!`).
- `region` is now validated against an enum on both frontend (`src/constants/regions.ts`) and backend (`VALID_REGIONS` in `Company.ts`).
- Onboarding page is now accessible post-registration.
- `isLoading` guard in `ProtectedRoute` prevents race condition redirect to `/login` on hard refresh.

---

## CSV Upload Format

For bulk uploading emission logs via the CSV uploader, the file must have these column headers (case-sensitive):

```csv
date,department,activityType,rawAmount,rawUnit,source
2024-01-15,HR,Travel,500,miles,Business trip
2024-01-16,Manufacturing,Utilities,2000,kWh,Monthly bill
2024-01-17,Logistics,Supply Chain,1500,kg,Shipment
```

| Column | Required | Description |
|--------|----------|-------------|
| `date` | Yes | ISO date string (YYYY-MM-DD) |
| `department` | Yes | Must match an existing department name (case-insensitive) |
| `activityType` | Yes | One of: `Travel`, `Utilities`, `Supply Chain`, `Other` |
| `rawAmount` | Yes | Numeric value |
| `rawUnit` | Yes | Unit matching the activity type (e.g., `miles`, `kWh`, `kg`, `unit`) |
| `source` | No | Optional description |

Unmatched department names or invalid data will be reported as row-level errors in the upload response.

---

## For Future Agents

If you are an agent picking up this project, here is a quick-start checklist:

1. **Copy `.env.example` to `.env`** and set `JWT_SECRET` to any random string before running.
2. **Run** `npm install && npm run dev` and wait for `Server running on http://0.0.0.0:3000`.
3. **Lint** with `npm run lint` (runs `tsc --noEmit`). The project should pass cleanly.
4. **Login** at `http://localhost:3000/login` with `admin@ecotrack.com` / `Password123!`.
5. **Key files to understand first**:
   - `server.ts` -- entire server bootstrap
   - `server/middleware/auth.ts` -- JWT verification and `req.user` typing
   - `server/controllers/authController.ts` -- register, login, getMe
   - `src/App.tsx` -- all routes and RBAC logic
   - `src/components/layout/DashboardLayout.tsx` -- sidebar navigation and role filtering
   - `src/context/AuthContext.tsx` -- how auth state and JWT are managed
6. **The database is ephemeral** -- all data is lost when the server restarts (unless `MONGO_URI` is set).
7. **All API routes are now protected** -- requests without a valid JWT will receive 401.
8. **The legacy `DataManagementPage.tsx`** is dead code and can be removed.
