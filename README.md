# 🍃 EcoTrack

### Carbon Emission Tracking & Analytics Platform

EcoTrack empowers companies to **log**, **visualize**, and **report** their carbon emissions — enabling data-driven sustainability decisions through an intuitive analytics dashboard.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#-environment-variables)
- [Git Workflow](#-git-workflow)
  - [Branch Naming Convention](#branch-naming-convention)
  - [Commit Message Convention](#commit-message-convention)
  - [Pull Request Process](#pull-request-process)
- [Coding Standards](#-coding-standards)
- [Team Development Guidelines](#-team-development-guidelines)
- [Future Modules](#-future-modules)
- [Contributors](#-contributors)

---

## 🌍 Project Overview

**EcoTrack** is a full-stack MERN application designed to help organizations track, analyze, and manage their carbon footprint. The platform provides:

| Feature | Description |
|---------|-------------|
| **Carbon Emission Logs** | Record and manage emission data across departments and categories |
| **CSV / Excel Upload** | Bulk-import emission records from spreadsheet files |
| **Analytics Dashboard** | Interactive charts and visualizations for emission trends |
| **Report Export** | Generate downloadable PDF and Excel reports |
| **Company Management** | Multi-company support with role-based access |
| **User Profiles** | Secure authentication with personalized dashboards |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React 19)                    │
│  Vite 8 · Tailwind CSS v4 · React Router · Axios        │
│  Framer Motion · Recharts · Lucide Icons                 │
├──────────────────────┬──────────────────────────────────┤
│                      │  REST API (/api)                  │
├──────────────────────┴──────────────────────────────────┤
│                     SERVER (Express.js)                   │
│  Helmet · CORS · Morgan · JWT · Multer · csv-parser      │
├─────────────────────────────────────────────────────────┤
│                     DATABASE (MongoDB)                    │
│  Mongoose ODM                                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI component library |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| React Router DOM | 7.x | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| React Hook Form | 7.x | Performant form management |
| React Hot Toast | 2.x | Toast notifications |
| Framer Motion | 12.x | Animations & transitions |
| Lucide React | 1.x | Icon library |
| Recharts | 3.x | Charting / data visualization |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.x | Web framework |
| MongoDB | 7+ | NoSQL database |
| Mongoose | 8.x | MongoDB object modeling |
| JSON Web Token | 9.x | Authentication tokens |
| bcryptjs | 2.x | Password hashing |
| Multer | 1.x | File upload middleware |
| csv-parser | 3.x | CSV file parsing |
| xlsx | 0.x | Excel file parsing |
| Helmet | 8.x | Security HTTP headers |
| Morgan | 1.x | HTTP request logger |
| CORS | 2.x | Cross-origin resource sharing |
| cookie-parser | 1.x | Cookie handling |
| dotenv | 16.x | Environment variable management |

### Dev Tools

| Tool | Purpose |
|------|---------|
| Nodemon | Auto-restart server on file changes |
| ESLint | JavaScript linting |
| Prettier | Code formatting |
| Git | Version control |

---

## 📁 Project Structure

```
EcoTrack/
│
├── .gitignore                        # Git ignore rules
├── .prettierrc                       # Prettier configuration
├── .eslintrc.json                    # Root ESLint configuration
├── README.md                         # This file
│
├── client/                           # ──── FRONTEND ────
│   ├── .env                          # Client environment variables
│   ├── index.html                    # HTML entry point (SEO meta tags)
│   ├── package.json                  # Client dependencies & scripts
│   ├── vite.config.js                # Vite + React + Tailwind + @ alias
│   │
│   └── src/
│       ├── main.jsx                  # React entry point
│       ├── App.jsx                   # Root component (Router + Toaster)
│       │
│       ├── assets/                   # Static files (images, icons, fonts)
│       │
│       ├── charts/                   # Recharts wrapper components
│       │                             #   e.g., EmissionLineChart.jsx
│       │
│       ├── components/
│       │   ├── common/               # ── Reusable UI Primitives ──
│       │   │   ├── Button.jsx        #   Variants · Sizes · Loading state
│       │   │   ├── Card.jsx          #   Container with title & hover
│       │   │   ├── Input.jsx         #   Label · Error · Icon · ref-forward
│       │   │   ├── Modal.jsx         #   Portal · AnimatePresence · Escape
│       │   │   └── Loader.jsx        #   Spinner · Fullscreen overlay
│       │   │
│       │   └── layouts/              # ── App Shell ──
│       │       ├── MainLayout.jsx    #   Navbar + Sidebar + Outlet + Footer
│       │       ├── Navbar.jsx        #   Sticky top bar with branding
│       │       ├── Sidebar.jsx       #   Collapsible nav with icons
│       │       └── Footer.jsx        #   Copyright + links
│       │
│       ├── context/                  # React Context providers
│       │                             #   e.g., AuthContext.jsx
│       │
│       ├── hooks/                    # Custom React hooks
│       │                             #   e.g., useDebounce.js
│       │
│       ├── pages/                    # ── Route-Level Pages ──
│       │   ├── Landing.jsx           #   Public landing page
│       │   ├── Login.jsx             #   Authentication - login
│       │   ├── Register.jsx          #   Authentication - register
│       │   ├── Dashboard.jsx         #   Main dashboard
│       │   ├── CompanySetup.jsx      #   Company configuration
│       │   ├── CarbonLogs.jsx        #   Emission log management
│       │   ├── CsvUpload.jsx         #   CSV/Excel file upload
│       │   ├── Analytics.jsx         #   Charts & visualizations
│       │   ├── Profile.jsx           #   User profile
│       │   └── NotFound.jsx          #   404 error page
│       │
│       ├── routes/
│       │   └── AppRoutes.jsx         # Route definitions & layout mapping
│       │
│       ├── services/
│       │   └── api.js                # Axios instance + interceptors
│       │
│       ├── styles/
│       │   └── index.css             # Tailwind @theme tokens + globals
│       │
│       └── utils/                    # Shared helper functions
│                                     #   e.g., formatDate.js, classNames.js
│
└── server/                           # ──── BACKEND ────
    ├── .env                          # Server environment variables
    ├── .env.example                  # Env template (committed to Git)
    ├── package.json                  # Server dependencies & scripts
    ├── server.js                     # Express app entry point
    │
    ├── config/
    │   └── db.js                     # MongoDB connection via Mongoose
    │
    ├── controllers/                  # Route handler functions
    │                                 #   e.g., authController.js
    │
    ├── middleware/
    │   ├── errorHandler.js           # Centralized error handling
    │   └── notFound.js               # 404 catch-all middleware
    │                                 #   Add: authMiddleware.js, etc.
    │
    ├── models/                       # Mongoose schema definitions
    │                                 #   e.g., User.js, EmissionLog.js
    │
    ├── routes/
    │   └── healthRoutes.js           # GET /api/health
    │                                 #   Add: authRoutes.js, etc.
    │
    ├── services/                     # Business logic layer
    │                                 #   e.g., emissionService.js
    │
    ├── uploads/                      # Multer file destination (gitignored)
    │
    ├── utils/
    │   ├── asyncHandler.js           # Async try/catch wrapper
    │   ├── ApiError.js               # Custom error class (statusCode)
    │   └── ApiResponse.js            # Standardized JSON response
    │
    └── validators/                   # Request validation schemas
                                      #   e.g., authValidator.js
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| **Node.js** | 18.x or higher | `node --version` |
| **npm** | 9.x or higher | `npm --version` |
| **MongoDB** | 7.x or higher | `mongod --version` |
| **Git** | 2.x or higher | `git --version` |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/ecotrack.git
cd ecotrack

# 2. Set up the server
cd server
cp .env.example .env          # Create your local env file
npm install                    # Install server dependencies

# 3. Set up the client (open a new terminal)
cd client
npm install                    # Install client dependencies
```

> [!TIP]
> If you encounter network issues during `npm install`, try running with `npm install --legacy-peer-deps`.

### Running the Application

**Start MongoDB** (if running locally):
```bash
mongod
```

**Start the Server** (Terminal 1):
```bash
cd server
npm run dev
# ✅ Server running on http://localhost:5000
# ✅ MongoDB Connected
```

**Start the Client** (Terminal 2):
```bash
cd client
npm run dev
# ✅ Client running on http://localhost:5173
```

**Verify the setup:**
```bash
# Health check endpoint
curl http://localhost:5000/api/health

# Expected response:
# {
#   "statusCode": 200,
#   "data": { "status": "running" },
#   "message": "Server is healthy",
#   "success": true
# }
```

### Available Scripts

| Directory | Command | Description |
|-----------|---------|-------------|
| `server/` | `npm run dev` | Start server with auto-reload (nodemon) |
| `server/` | `npm start` | Start server in production mode |
| `server/` | `npm run lint` | Lint server code |
| `server/` | `npm run format` | Format server code with Prettier |
| `client/` | `npm run dev` | Start Vite dev server with HMR |
| `client/` | `npm run build` | Build for production |
| `client/` | `npm run preview` | Preview production build locally |
| `client/` | `npm run lint` | Lint client code |
| `client/` | `npm run format` | Format client code with Prettier |

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ecotrack` |
| `JWT_SECRET` | Secret key for JWT signing | *(required)* |
| `JWT_EXPIRE` | JWT token expiry | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `COOKIE_SECRET` | Secret for signed cookies | *(required)* |

### Client (`client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application display name | `EcoTrack` |

> [!CAUTION]
> **Never commit `.env` files to Git.** The `.gitignore` is pre-configured to exclude them. Use `.env.example` as a template for your team.

> [!NOTE]
> All client-side environment variables **must** be prefixed with `VITE_` to be accessible via `import.meta.env`.

---

## 🔀 Git Workflow

We follow a **Git Flow** branching model designed for collaborative team development.

```
main                          ← Production releases only
│
├── develop                   ← Integration branch (all PRs merge here)
│   │
│   ├── feature/auth          ← Feature branches (from develop)
│   ├── feature/carbon-logs
│   ├── feature/analytics
│   └── ...
│
├── bugfix/fix-upload-crash   ← Bug fix branches (from develop)
│
├── hotfix/security-patch     ← Emergency fixes (from main)
│
└── release/v1.0.0            ← Release candidates (from develop)
```

### Branch Naming Convention

Use the following prefixes with **kebab-case** descriptions:

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New feature development | `feature/auth-login` |
| `bugfix/` | Non-critical bug fixes | `bugfix/csv-parse-error` |
| `hotfix/` | Critical production fixes | `hotfix/jwt-token-expire` |
| `release/` | Release preparation | `release/v1.0.0` |
| `refactor/` | Code refactoring | `refactor/api-response-format` |
| `docs/` | Documentation only | `docs/api-endpoints` |
| `test/` | Test additions | `test/emission-service` |

**Rules:**
- ✅ `feature/csv-upload-validation`
- ✅ `bugfix/sidebar-collapse-mobile`
- ❌ `myFeature` — missing prefix
- ❌ `feature/Add_New_Page` — use kebab-case, not PascalCase

### Commit Message Convention

Follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

| Type | When to Use | Example |
|------|------------|---------|
| `feat` | New feature | `feat(auth): add JWT login endpoint` |
| `fix` | Bug fix | `fix(upload): handle empty CSV files` |
| `docs` | Documentation | `docs(readme): add environment setup guide` |
| `style` | Formatting (no logic change) | `style(button): fix indentation` |
| `refactor` | Code restructure (no feature change) | `refactor(api): extract response helper` |
| `test` | Adding or fixing tests | `test(auth): add login validation tests` |
| `chore` | Build, config, or tooling | `chore(deps): update express to 4.21` |
| `perf` | Performance improvement | `perf(charts): lazy load Recharts components` |

**Rules:**
- Use **imperative mood**: "add feature" not "added feature"
- Keep the subject line under **72 characters**
- Reference issue numbers: `fix(auth): resolve token refresh (#42)`

### Pull Request Process

1. **Create** a feature branch from `develop`
2. **Develop** your feature with meaningful commits
3. **Push** your branch and create a Pull Request to `develop`
4. **Request review** from at least 1 team member
5. **Address** review comments
6. **Squash & merge** once approved

> [!IMPORTANT]
> **Never push directly to `main` or `develop`.** All changes must go through Pull Requests with code review.

---

## 📝 Coding Standards

### General Rules

| Rule | Details |
|------|---------|
| **Formatting** | Prettier auto-formats on save — config in `.prettierrc` |
| **Linting** | ESLint enforces code quality — config in `.eslintrc.json` |
| **Semicolons** | Always use semicolons |
| **Quotes** | Single quotes for strings |
| **Trailing Commas** | Use trailing commas (ES5 style) |
| **Indentation** | 2 spaces (never tabs) |
| **Line Length** | Max 100 characters |
| **ES Modules** | Use `import/export` — no `require()` |

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React Components | PascalCase | `CarbonLogs.jsx`, `Button.jsx` |
| Hooks | camelCase with `use` prefix | `useDebounce.js`, `useAuth.js` |
| Utilities | camelCase | `formatDate.js`, `classNames.js` |
| Services | camelCase | `api.js`, `authService.js` |
| Models (backend) | PascalCase | `User.js`, `EmissionLog.js` |
| Controllers | camelCase | `authController.js` |
| Middleware | camelCase | `errorHandler.js`, `authMiddleware.js` |
| CSS | kebab-case | `index.css` |
| Environment | UPPER_SNAKE_CASE | `MONGO_URI`, `JWT_SECRET` |

### Frontend Standards

```jsx
// ✅ Always use the reusable API instance
import api from '@/services/api';
const { data } = await api.get('/carbon-logs');

// ❌ Never use raw axios
import axios from 'axios';  // DON'T DO THIS

// ✅ Use @ alias for imports
import Button from '@/components/common/Button';

// ❌ Don't use deep relative paths
import Button from '../../../components/common/Button';

// ✅ Use reusable components
<Button variant="primary" isLoading={loading}>Submit</Button>
<Input label="Email" error={errors.email?.message} {...register('email')} />
<Card title="Emission Summary" hoverable>{content}</Card>

// ✅ Use react-hot-toast for notifications
import toast from 'react-hot-toast';
toast.success('Log saved successfully');
toast.error('Failed to upload CSV');

// ✅ Use react-hook-form for forms
import { useForm } from 'react-hook-form';
const { register, handleSubmit, formState: { errors } } = useForm();
```

### Backend Standards

```javascript
// ✅ Always wrap async handlers
import asyncHandler from '../utils/asyncHandler.js';

export const getItems = asyncHandler(async (req, res) => {
  // If this throws, errorHandler.js catches it automatically
  const items = await Item.find();
  res.status(200).json(new ApiResponse(200, items, 'Items fetched'));
});

// ✅ Use ApiError for controlled errors
import ApiError from '../utils/ApiError.js';

if (!user) {
  throw new ApiError(404, 'User not found');
}

// ✅ Use ApiResponse for all success responses
import ApiResponse from '../utils/ApiResponse.js';

res.status(201).json(new ApiResponse(201, newLog, 'Emission log created'));

// ❌ Never send raw JSON responses
res.json({ message: 'success' });  // DON'T DO THIS
```

---

## 👥 Team Development Guidelines

### Team of 8 — Suggested Ownership

| Developer | Module | Branch |
|-----------|--------|--------|
| Dev 1 | Authentication (Login, Register, JWT, Middleware) | `feature/auth` |
| Dev 2 | Company Setup (CRUD, Settings) | `feature/company` |
| Dev 3 | Carbon Emission Logs (CRUD, Filters, Pagination) | `feature/carbon-logs` |
| Dev 4 | CSV/Excel Upload (Multer, Parsing, Validation) | `feature/csv-upload` |
| Dev 5 | Analytics Dashboard (Charts, Metrics, Filters) | `feature/analytics` |
| Dev 6 | Report Export (PDF, Excel Generation) | `feature/export-reports` |
| Dev 7 | User Profile & Settings | `feature/profile` |
| Dev 8 | UI Components, Theming & Responsive Design | `feature/ui-components` |

### Communication Protocol

- **Daily**: Quick sync on blockers and progress
- **PR Reviews**: Every PR needs at least **1 reviewer** before merge
- **Conflicts**: Communicate before working on shared files (layouts, routes, models)
- **Documentation**: Update README when adding new modules or environment variables

### Adding a New Feature (Step-by-Step)

#### Backend
```bash
# 1. Create the model
server/models/EmissionLog.js

# 2. Create the controller
server/controllers/emissionController.js

# 3. Create the route
server/routes/emissionRoutes.js

# 4. Register the route in server.js
app.use('/api/emissions', emissionRoutes);

# 5. (Optional) Add validation
server/validators/emissionValidator.js
```

#### Frontend
```bash
# 1. Create the page component
client/src/pages/CarbonLogs.jsx

# 2. Add the route in AppRoutes.jsx
<Route path="/carbon-logs" element={<CarbonLogs />} />

# 3. Create API service functions
client/src/services/emissionService.js

# 4. Add navigation link in Sidebar.jsx
{ to: '/carbon-logs', icon: FileText, label: 'Carbon Logs' }
```

### Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Use `asyncHandler` for all async routes | Write raw `try/catch` in every controller |
| Return `ApiResponse` for all API responses | Send inconsistent JSON formats |
| Use `ApiError` for error responses | Use `res.status(500).send('error')` |
| Import from `@/services/api` | Create new Axios instances |
| Use components from `components/common/` | Build ad-hoc buttons and inputs |
| Use `react-hook-form` for forms | Use uncontrolled forms with `useState` |
| Add env vars to `.env.example` | Hardcode URLs or secrets |
| Write descriptive commit messages | Write `fix`, `update`, `changes` |

---

## 🔮 Future Modules

The following modules are planned for development. Each will be built on top of this foundation:

| Module | Description | Priority |
|--------|-------------|----------|
| 🔐 **Authentication** | JWT-based login, register, password reset, email verification | 🔴 High |
| 🏢 **Company Management** | Create, update, delete companies; assign users to companies | 🔴 High |
| 📊 **Carbon Emission CRUD** | Full log management with categories, scopes (1/2/3), and dates | 🔴 High |
| 📁 **CSV/Excel Upload** | Bulk import with validation, preview, and error reporting | 🟡 Medium |
| 📈 **Analytics Dashboard** | Line charts, bar charts, pie charts, emission trends, comparisons | 🟡 Medium |
| 📄 **Report Export** | Generate PDF and Excel reports with charts and summaries | 🟡 Medium |
| 👤 **User Profile** | Avatar upload, password change, notification preferences | 🟢 Low |
| 🌙 **Dark Mode** | Toggle between light and dark themes | 🟢 Low |
| 🔔 **Notifications** | In-app and email notifications for milestones and alerts | 🟢 Low |
| 📱 **PWA Support** | Progressive Web App for mobile offline access | 🟢 Low |
| 🧪 **Testing Suite** | Unit tests (Jest/Vitest), integration tests, E2E (Playwright) | 🟡 Medium |
| 🐳 **Docker Setup** | Containerized deployment with Docker Compose | 🟢 Low |

---

## 🤝 Contributors

| Team Lead | Dev 1 | Dev 2 | Dev 3 |
|:---------:|:-----:|:-----:|:-----:|
| **Dev 4** | **Dev 5** | **Dev 6** | **Dev 7** |

---

> 💚 Built with love by the **EcoTrack Team** — *Making sustainability measurable, one emission at a time.*
