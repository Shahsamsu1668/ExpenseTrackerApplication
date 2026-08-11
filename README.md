# 💰 Expense Tracker

A complete, production-quality full-stack personal finance management application built with React, Node.js, Express, PostgreSQL, and Prisma ORM.

---

## Overview

Expense Tracker is a modern SaaS-style financial dashboard that allows users to register an account, log in securely, and manage their personal income and expenses. All data is user-isolated — each user can only see and manage their own transactions and categories.

---

## Features

- ✅ User registration and secure login (JWT)
- ✅ Personal financial dashboard with charts
- ✅ Add, edit, and delete transactions (income/expense)
- ✅ Create, edit, and delete custom categories
- ✅ Dashboard: Total Income, Total Expenses, Balance
- ✅ Income vs Expenses monthly trend chart
- ✅ Expense breakdown donut chart by category
- ✅ Search transactions by title
- ✅ Filter by Type, Category, and Date Range
- ✅ Monthly Expense Target with visual tracking
- ✅ Target notifications (Approaching and Exceeded states)
- ✅ Server-side pagination
- ✅ Custom elegant grayscale/slate UI theme
- ✅ User profile management (Profile picture uploads & User ID display)
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Loading skeletons, empty states, toast notifications
- ✅ Protected routes with JWT authentication
- ✅ Centralized error handling

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS |
| **Forms** | React Hook Form, Zod |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Notifications** | react-hot-toast |
| **Backend** | Node.js, Express.js |
| **Authentication** | JWT, bcryptjs |
| **File Uploads** | Multer |
| **Validation** | Zod |
| **Security** | Helmet, CORS, express-rate-limit |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Dev Tools** | nodemon, dotenv, ESLint |

---

## Project Structure

```
expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext
│   │   ├── layouts/        # DashboardLayout (sidebar)
│   │   ├── pages/          # Login, Register, Dashboard, Transactions, Categories, Profile
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── services/       # Axios API service layer
│   │   ├── utils/          # formatters, helpers
│   │   ├── App.jsx         # Router + providers
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── config/         # Prisma client singleton
│   │   ├── controllers/    # Thin request/response handlers
│   │   ├── middleware/     # auth.js, errorHandler.js
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # AppError class
│   │   ├── validators/     # Zod schemas for each entity
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # HTTP server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Demo data seeder
│   └── .env.example
│
├── docker-compose.yml      # PostgreSQL container
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- [PostgreSQL](https://www.postgresql.org/) v13+ (local or Docker)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

## Environment Variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_tracker
JWT_SECRET=your_super_secure_jwt_secret_change_in_production_min_32_chars
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database Setup

### Option A — PostgreSQL Locally

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE expense_tracker;
   ```
3. Update `DATABASE_URL` in `backend/.env`

### Option B — PostgreSQL with Docker

```bash
# Start PostgreSQL container
docker-compose up -d

# The database will be available at:
# postgresql://postgres:postgres@localhost:5432/expense_tracker
```

---

## Prisma Migration

```bash
cd backend

# Run migrations (uses local Prisma v5 to avoid version conflicts)
npm run prisma:migrate
# OR equivalently:
# node_modules/.bin/prisma migrate dev --name init

# Generate Prisma client
npm run prisma:generate
```

---

## Seeding Database

```bash
cd backend

# Run seed script (creates demo user + sample data)
npm run seed
```

This creates:
- Demo user with realistic categories and 44 sample transactions
- See **Demo Credentials** section below

---

## Backend Installation

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and fill in your values.

---

## Frontend Installation

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`.

---

## How to Run

### Backend

```bash
cd backend
npm run dev
# Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm run dev
# Starts on http://localhost:5173
```

---

## API Endpoints

All protected endpoints require `Authorization: Bearer <token>` header.

### AUTH

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/auth/me` | Required | Get current user |
| POST | `/api/auth/profile-picture` | Required | Upload user profile picture (`multipart/form-data`) |

**Register body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password1",
  "confirmPassword": "Password1"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "Password1"
}
```

### TRANSACTIONS

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/transactions` | Required | List with filters/pagination |
| GET | `/api/transactions/:id` | Required | Get single transaction |
| POST | `/api/transactions` | Required | Create transaction |
| PUT | `/api/transactions/:id` | Required | Update transaction |
| DELETE | `/api/transactions/:id` | Required | Delete transaction |

**Query parameters for GET `/api/transactions`:**
- `search` — search by title (case-insensitive)
- `type` — `INCOME` or `EXPENSE`
- `categoryId` — filter by category ID
- `startDate` — ISO date string
- `endDate` — ISO date string
- `page` — page number (default: 1)
- `limit` — items per page (default: 10, max: 100)

**Example:**
```
GET /api/transactions?type=EXPENSE&startDate=2026-01-01&endDate=2026-01-31&page=1&limit=10
```

**Create/Update body:**
```json
{
  "title": "Monthly Salary",
  "amount": 5000.00,
  "type": "INCOME",
  "categoryId": "<category-id>",
  "transactionDate": "2026-08-01"
}
```

### CATEGORIES

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | Required | List all user categories |
| POST | `/api/categories` | Required | Create category |
| PUT | `/api/categories/:id` | Required | Update category |
| DELETE | `/api/categories/:id` | Required | Delete category |

**Create/Update body:**
```json
{
  "name": "Food",
  "type": "EXPENSE"
}
```

### EXPENSE TARGET

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/expense-target` | Required | Get current expense target |
| POST | `/api/expense-target` | Required | Create or update expense target |
| PUT | `/api/expense-target` | Required | Update expense target |
| DELETE | `/api/expense-target` | Required | Remove expense target |
| GET | `/api/expense-target/status` | Required | Get calculation of spent, remaining, and exceeded status |

**Create/Update body:**
```json
{
  "amount": 20000,
  "period": "MONTHLY"
}
```

### DASHBOARD

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Required | Full dashboard data |

**Response includes:**
- `summary.totalIncome` — sum of all income transactions
- `summary.totalExpenses` — sum of all expense transactions
- `summary.balance` — income − expenses
- `monthlyData` — last 6 months grouped by month
- `categoryBreakdown` — expense totals per category
- `recentTransactions` — last 5 transactions

---

## Authentication

The application uses JWT (JSON Web Tokens) for stateless authentication:

1. User registers or logs in → backend returns a signed JWT
2. Frontend stores JWT in `localStorage`
3. Axios interceptor attaches `Authorization: Bearer <token>` to every API request
4. Backend middleware verifies the token on every protected route
5. User identity (`userId`) is always taken from the **verified JWT**, never from request body
6. On token expiry or invalid token, the backend returns 401, which the frontend interceptor handles by clearing state and redirecting to `/login`

---

## Expense Target System

The system features a monthly expense target tracker:
- **Monthly Calculation:** It dynamically sums all `EXPENSE` transactions for the authenticated user within the current calendar month.
- **Visual Feedback:** Shows a progress bar on the dashboard. It turns orange at 80% (approaching target) and red at 100% (exceeded).
- **Notification Behavior:** If an added or edited transaction causes the total expenses to exceed the target, an in-app toast notification appears instantly. This notification is cached in the browser for the current month so it doesn't repeatedly show on page refreshes, but recalculates accurately if transactions are deleted or modified.


---

## Database Schema

```
User ─────────── Category (1:many, userId FK)
User ─────────── Transaction (1:many, userId FK)
Category ──────── Transaction (1:many, categoryId FK, onDelete: RESTRICT)
```

Key design decisions:
- `amount` stored as `Decimal(12,2)` — no floating-point precision issues
- `profilePicture` stored as string path, images served statically via Express
- Category has a unique constraint on `(name, type, userId)` — no duplicate category names per user per type
- Deleting a user cascades to their categories and transactions
- Deleting a category is **restricted** if any transactions reference it

---

## Demo Credentials

> ⚠️ **For local development only. Do not use in production.**

```
Email:    demo@example.com
Password: Demo@12345
```

This account includes:
- 12 categories (4 income, 8 expense)
- 44 realistic transactions over the past 5 months
- Pre-populated dashboard charts and summaries

---

## Validation

**Frontend (Zod + React Hook Form):**
- Inline field errors
- Password strength hints on register
- Disabled submit while loading

**Backend (Zod):**
- All request bodies validated before reaching services
- Consistent 422 Validation Error responses with field-level messages
- Category type/ownership verified on every transaction create/update

---

## Error Handling

The backend returns consistent JSON error responses:

```json
{
  "success": false,
  "message": "Transaction not found"
}
```

Error codes handled:
- `400` — Bad Request
- `401` — Unauthorized / Invalid token
- `403` — Forbidden
- `404` — Not Found
- `409` — Conflict (duplicate email, category in use)
- `422` — Validation Error (with `errors` array)
- `500` — Internal Server Error (no details leaked)

---

## Screenshots

*(Add screenshots of the dashboard, transactions page, login page, and mobile view here)*

---

## Future Improvements

- [ ] Export transactions to CSV/PDF
- [ ] Budget limits per category with alerts
- [ ] Multi-currency support
- [ ] Dark mode toggle
- [ ] Recurring transaction automation
- [ ] Email notifications for budget thresholds
- [ ] OAuth (Google/GitHub) login
- [ ] Data import from bank statements

---

## License

MIT License — free for personal and educational use.
