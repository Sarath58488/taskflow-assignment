# ✦ TaskFlow — Task Manager with Role-Based Access

A full-stack Task Manager application built with **React Native (Expo)** and **Node.js + Express + MongoDB**, featuring JWT authentication and role-based access control.

---

## 📱 Screenshots

> _Run the app and add screenshots to `/screenshots` folder_

| Login | Tasks (User) | Tasks (Admin) | Task Detail | Create Task | Profile |
|-------|-------------|---------------|-------------|-------------|---------|
| _(screensho)_ | _(screenshot)_ | _(screenshot)_ | _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## 🏗️ Project Structure

```
taskmanager/
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Seed demo data
│   ├── controllers/
│   │   ├── authController.js  # Login, signup, profile
│   │   └── taskController.js  # CRUD + role-filtered queries
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + adminOnly guards
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema (name, email, role)
│   │   └── Task.js            # Task schema (title, status, priority, assignedTo)
│   ├── routes/
│   │   ├── auth.js            # /api/auth/*
│   │   └── tasks.js           # /api/tasks/*
│   ├── .env.example
│   └── server.js              # Entry point
│
└── mobile/                    # React Native (Expo) app
    ├── src/
    │   ├── components/
    │   │   ├── TaskCard.js    # Task list item card
    │   │   └── UI.js          # Shared UI components (Button, Badge, Card, etc.)
    │   ├── context/
    │   │   └── AuthContext.js # Global auth state + AsyncStorage persistence
    │   ├── navigation/
    │   │   └── AppNavigation.js # Stack + Tab navigation
    │   ├── screens/
    │   │   ├── LoginScreen.js
    │   │   ├── SignupScreen.js
    │   │   ├── TasksScreen.js     # Task list with search & filter
    │   │   ├── TaskDetailScreen.js
    │   │   ├── CreateTaskScreen.js # Create & edit (Admin)
    │   │   └── ProfileScreen.js
    │   ├── services/
    │   │   └── api.js         # Axios-style fetch wrapper + token helpers
    │   └── utils/
    │       └── theme.js       # Design tokens (colors, fonts, spacing)
    ├── App.js
    └── app.json
```

---

## ✅ Features Implemented

### Authentication
- [x] JWT-based login and signup
- [x] Persistent session via AsyncStorage (survives app restart)
- [x] Protected routes — redirect to login if unauthenticated
- [x] Role stored in token payload

### Role-Based Access Control
| Feature | Admin | User |
|---------|-------|------|
| View all tasks | ✅ | ❌ |
| View assigned tasks | ✅ | ✅ |
| Create tasks | ✅ | ❌ |
| Assign tasks to users | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks only) |
| Edit task details | ✅ | ❌ |
| Delete tasks | ✅ | ❌ |

### Task Management
- [x] Task list with loading and empty states
- [x] Task detail view
- [x] Inline quick-status update from list
- [x] Full status update from detail screen
- [x] Search tasks by title/description
- [x] Filter tasks by status (Pending / In Progress / Completed)
- [x] Pull-to-refresh
- [x] Admin: Create tasks with title, description, priority, status, assigned user
- [x] Admin: Edit task details
- [x] Admin: Delete tasks with confirmation

### UI / UX
- [x] Dark theme with consistent design system
- [x] Priority color-coded cards (red/yellow/blue strip)
- [x] Status and priority badges
- [x] Demo login buttons for quick testing
- [x] Permission summary on profile screen

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator / Android Emulator **or** Expo Go app on your phone

---

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=change_this_to_a_random_secret_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
# Seed demo users and tasks
npm run seed

# Start the server
npm run dev       # development (nodemon)
# or
npm start         # production
```

The API will be running at `http://localhost:5000`

**Demo credentials (created by seed script):**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@taskmanager.com | admin123 |
| User | alice@taskmanager.com | user123 |
| User | bob@taskmanager.com | user123 |

---

### Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install
```

**⚠️ Important — Set your backend URL:**

Open `src/services/api.js` and update `BASE_URL`:

```js
// For local development (use your machine's LAN IP, NOT localhost)
const BASE_URL = 'http://192.168.1.XXX:5000/api';

// For deployed backend
const BASE_URL = 'https://your-backend.onrender.com/api';
```

> To find your LAN IP: run `ipconfig` (Windows) or `ifconfig` / `ip addr` (Mac/Linux)
> Both your phone and computer must be on the same Wi-Fi network.

```bash
# Start Expo
npx expo start

# Press:
# a  → Android emulator
# i  → iOS simulator
# Scan QR with Expo Go app on your phone
```

---

## 🌐 API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Private | Get current user |

**Login request:**
```json
POST /api/auth/login
{ "email": "admin@taskmanager.com", "password": "admin123" }
```

**Login response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "name": "Admin User", "email": "...", "role": "admin" }
  }
}
```

### Task Endpoints

All task routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Private | Get tasks (filtered by role) |
| GET | `/api/tasks/:id` | Private | Get single task |
| POST | `/api/tasks` | Admin | Create task |
| PUT | `/api/tasks/:id` | Private | Update task (User: status only) |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| GET | `/api/tasks/users` | Admin | List all users (for assignment) |

**Query params for GET /api/tasks:**
- `status` — `pending` | `in_progress` | `completed`
- `priority` — `low` | `medium` | `high`
- `search` — searches title and description
- `page` — pagination (default: 1)
- `limit` — per page (default: 20)

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Mobile | React Native (Expo) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State | React Context API |
| Storage | AsyncStorage (persistent login) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |

---

## 🚢 Deployment

### Backend (Render.com — free tier)
1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables (MONGODB_URI, JWT_SECRET, PORT, NODE_ENV=production)
6. Use MongoDB Atlas for the cloud database

### Frontend (Expo EAS Build)
```bash
npm install -g eas-cli
eas build --platform android   # APK for Android
eas build --platform ios       # IPA for iOS (requires Apple account)
```

Or share via **Expo Go** using the published project:
```bash
npx expo publish
```
