# DevPulse — Issue Tracker API

A REST API for software teams to report bugs and suggest features.

##  Live URL
Live Site Link: [Dev Pulse Live Website](https://dev-pulse-azure-tau.vercel.app)

---

##  Tech Stack
- Node.js, TypeScript, Express.js
- PostgreSQL (NeonDB) — Raw SQL
- bcrypt, jsonwebtoken

---

##  Features
- JWT Authentication
- Role-based access (contributor & maintainer)
- Create, view, update, delete issues
- Secure password hashing

---

##  Setup

```bash
# Install
npm install

# .env file
PORT=5000
CONNECTIONSTRING=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=1d

# Run
npm run dev
```

---

##  API Endpoints

### Auth
| Method | Endpoint         | Access | Description   |
|--------|------------------|--------|---------------|
| POST   | /api/auth/signup | Public | Register user |
| POST   | /api/auth/login  | Public | Login user    |

### Issues
| Method | Endpoint        | Access                  | Description    |
|--------|-----------------|-------------------------|----------------|
| GET    | /api/issues     | Public                  | Get all issues |
| GET    | /api/issues/:id | Public                  | Get one issue  |
| POST   | /api/issues     | Contributor, Maintainer | Create issue   |
| PATCH  | /api/issues/:id | Contributor, Maintainer | Update issue   |
| DELETE | /api/issues/:id | Maintainer only         | Delete issue   |

---

##  Database Schema

### users
| Column     | Type         | Notes                     |
|------------|--------------|---------------------------|
| id         | SERIAL       | Primary key               |
| name       | VARCHAR(150) | Required                  |
| email      | VARCHAR(200) | Unique, required          |
| password   | VARCHAR(200) | Hashed, never returned    |
| role       | VARCHAR(20)  | contributor or maintainer |
| created_at | TIMESTAMP    | Auto-generated            |
| updated_at | TIMESTAMP    | Auto-updated              |

### issues
| Column      | Type        | Notes                          |
|-------------|-------------|--------------------------------|
| id          | SERIAL      | Primary key                    |
| title       | TEXT        | Max 150 chars, required        |
| description | TEXT        | Min 20 chars, required         |
| type        | VARCHAR(40) | bug or feature_request         |
| status      | VARCHAR(40) | open, in_progress, resolved    |
| reporter_id | INT         | References users.id            |
| created_at  | TIMESTAMP   | Auto-generated                 |
| updated_at  | TIMESTAMP   | Auto-updated                   |

---

##  Roles & Permissions
| Role        | Permissions                                     |
|-------------|-------------------------------------------------|
| contributor | Register, login, create issues, view issues     |
| maintainer  | All above + update, delete, change status       |