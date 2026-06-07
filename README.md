# DevPulse Issue Tracker API

A RESTful API for managing bug reports and feature requests, built with Node.js, Express, TypeScript, and PostgreSQL.

**Live URL:** `https://assignment-2-six-tau.vercel.app`

---

## Features

- User registration and login with JWT authentication
- Role-based access control (contributor, maintainer)
- Create, read, update, and delete issues
- Filter issues by type and status; sort by newest or oldest
- Passwords hashed with bcrypt
- Reporter details embedded in issue responses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | PostgreSQL (via `pg`) |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Deployment | Vercel |

---

## Setup

### Prerequisites

- Node.js >= 18
- PostgreSQL database

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd assignment-2

# 2. Install dependencies
npm install

# 3. Create a .env file
cp .env.example .env
# Fill in your values (see Environment Variables below)

# 4. Run database migrations (create tables manually — see schema below)

# 5. Start development server
npm run dev

# 6. Build for production
npm run build
npm start
```

### Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/issues` | Public | Get all issues (with filters) |
| GET | `/api/issues/:id` | Public | Get a single issue |
| POST | `/api/issues` | Contributor, Maintainer | Create a new issue |
| PATCH | `/api/issues/:id` | Contributor (own + open), Maintainer (any) | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer | Delete an issue |

#### Query Parameters for `GET /api/issues`

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | — |
| `status` | `open`, `in_progress`, `resolved` | — |

**Example:** `GET /api/issues?sort=oldest&type=bug&status=open`

#### Auth Header (for protected routes)

```
Authorization: <JWT_TOKEN>
```

---

## Database Schema

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | |
| `name` | VARCHAR | |
| `email` | VARCHAR | Unique |
| `password` | VARCHAR | bcrypt hashed |
| `role` | VARCHAR | `contributor` (default) or `maintainer` |

### `issues`

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | |
| `title` | VARCHAR | |
| `description` | TEXT | |
| `type` | VARCHAR | `bug` or `feature_request` |
| `status` | VARCHAR | `open` (default), `in_progress`, `resolved` |
| `reporter_id` | INTEGER | Foreign key → `users.id` |
| `created_at` | TIMESTAMP | Auto-set |
| `updated_at` | TIMESTAMP | Auto-updated |

### SQL to create tables

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'contributor'
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  reporter_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
