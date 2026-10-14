# DISASTER RELIEF COORDINATION AND MANAGEMENT SYSTEM

A real-world, full-stack disaster management and humanitarian emergency coordination platform. Built for rapid, reliable communication between affected citizens, verified NGOs, field rescue volunteers, and government incident command control rooms during natural catastrophes (floods, cyclones, earthquakes, and emergency disasters).

---

## 🌟 Key Highlights & Features

### 1. 👥 Multi-Role Authorization & Access Control
- **Citizen**: Submit emergency calls with interactive map coordinates, track live responder assignment, view resolution notes.
- **NGO / Organization**: Browse unassigned emergencies, claim requests, dispatch relief convoys, update status.
- **Field Volunteer**: Direct boots-on-the-ground updates, mark activities in progress, confirm delivery.
- **Government Control Room**: Live geospatial tactical map, KPI dashboard, regional coverage gap analysis, humanitarian resource stockpile dispatch.
- **System Administrator**: User governance, role elevation, duplicate proximity monitoring, operational audit trail.

### 2. 🛟 Rule-Based Priority Calculation (No Black-Box AI)
- Transparent, deterministic backend logic evaluates:
  - Life-threatening danger keywords (`trapped`, `drowning`, `cardiac`, `oxygen`, `water rising`, `infant`).
  - Emergency category (Rescue, Medical, Food & Clean Water, Emergency Shelter).
  - Number of people affected.
- Generates clear, human-understandable explanations for assigned priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).

### 3. 🔍 Geographic Duplicate Request Detection
- Employs the **Haversine Formula** to compute real-world spherical distance between incident coordinates.
- If a new emergency arrives in the same category within **500 meters** of an existing active request, the system flags it as a **Possible Duplicate** with a confidence score.
- **Zero Data Loss**: Duplicate requests are never auto-deleted, ensuring secondary victims are not abandoned.

### 4. 🗺️ Interactive Geospatial Maps (Leaflet + OpenStreetMap)
- Zero paid API dependencies.
- OpenStreetMap tile layers with proper humanitarian attribution.
- Priority-coded markers with pulsating visual indicators for `CRITICAL` peril.
- Interactive coordinate picker with one-click **GPS location detection** (`navigator.geolocation`).

### 5. 📡 Relief Coverage Gap Analysis
- Spatial cluster aggregation grouping pending emergencies within a 2.5km vicinity.
- Computes pending-to-responder deficit ratios.
- Renders dashed red perimeter circles around critical unserved zones and generates actionable dispatch recommendations for government authorities.

### 6. 📦 Humanitarian Resource Inventory & Allocation
- Track supplies: Emergency Food Kits, Medical Trauma Bags, Inflatable Rescue Boats, Waterproof Tents.
- Direct allocation from depot stocks to active incident IDs.
- Atomic database operations preventing allocations from exceeding available inventory.

### 7. 📶 Low Connectivity & Resilience
- **Auto-draft preservation**: Emergency form contents are continuously preserved in `localStorage` and automatically restored if the browser disconnects or refreshes.
- Live browser online/offline status detection with instant reconnection alerts.

---

## 🏗️ Architecture & Technology Stack

```
                                  [ Affected Citizens ]
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REACT.JS + VITE FRONTEND                              │
│  - React Router DOM     - Leaflet & React Leaflet (OpenStreetMap)               │
│  - Lucide React Icons   - LocalStorage Draft Resilience                         │
│  - Clean Responsive CSS - 1-Click Demo Role Switcher Bar                        │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ REST APIs (JSON / JWT)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           NODE.JS + EXPRESS BACKEND                             │
│  - JWT Authentication Middleware    - Role-Based Access Control (RBAC)          │
│  - Haversine Proximity Calculator   - Rule-Based Priority Engine                │
│  - Atomic Safe Claiming Engine      - Centralized Audit Logging System          │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MONGODB DATA STORAGE                                  │
│  - MongoDB Atlas Cloud / Local MongoDB                                          │
│  - Zero-Config Instant In-Memory Store Fallback for Immediate Viva Testing      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Folder Structure

```
disaster-relief-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB & graceful fallback configuration
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile retrieval
│   │   ├── requestController.js  # Emergency lifecycle & atomic claiming
│   │   ├── resourceController.js # Stockpile inventory & incident allocation
│   │   ├── dashboardController.js# Stats, coverage gaps, map data
│   │   ├── userController.js     # User management & role modification
│   │   └── activityController.js # System activity audit log
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── role.js               # Role-based authorization
│   │   └── error.js              # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   ├── EmergencyRequest.js   # Requests with geo-coords & duplicate flags
│   │   ├── Resource.js           # Inventory pools with allocation history
│   │   └── ActivityLog.js        # Audit trail records
│   ├── routes/                   # Clean Express REST route endpoints
│   ├── services/
│   │   └── storageService.js     # Mongoose + Instant in-memory storage adapter
│   ├── utils/
│   │   ├── distance.js           # Haversine distance formula
│   │   ├── priority.js           # Rule-based priority calculator
│   │   ├── duplicate.js          # Proximity duplicate detector
│   │   └── seed.js               # Realistic Chennai demo dataset
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top nav with demo role switcher
│   │   │   ├── Sidebar.jsx       # Role-specific dashboard navigation
│   │   │   ├── LeafletMap.jsx    # OpenStreetMap with custom priority pins
│   │   │   ├── PriorityBadge.jsx # Critical / High / Medium / Low badges
│   │   │   ├── StatusBadge.jsx   # Pending / Assigned / In Progress / Resolved
│   │   │   ├── OfflineBanner.jsx # Connectivity alert
│   │   │   ├── DuplicateWarningAlert.jsx # Duplicate alert callout
│   │   │   └── AllocateModal.jsx # Inventory allocation dialog
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global session state & demo login
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── CreateEmergencyPage.jsx
│   │   │   ├── CitizenRequestsPage.jsx
│   │   │   ├── RequestDetailsPage.jsx
│   │   │   ├── ReliefDashboard.jsx
│   │   │   ├── AvailableRequestsPage.jsx
│   │   │   ├── MyAssignmentsPage.jsx
│   │   │   ├── ControlRoomDashboard.jsx
│   │   │   ├── LiveMapPage.jsx
│   │   │   ├── RequestsMonitoringPage.jsx
│   │   │   ├── CoverageGapsPage.jsx
│   │   │   ├── ResourcesPage.jsx
│   │   │   ├── ActivityMonitoringPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagementPage.jsx
│   │   │   └── DuplicateMonitoringPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── utils/
│   │   │   └── translations.js   # Multi-language dictionary (English & Tamil)
│   │   ├── App.jsx               # React Router routes with RBAC guards
│   │   ├── main.jsx
│   │   └── index.css             # Comprehensive modern CSS design system
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── run-dev.js                    # Concurrent runner for both servers
├── package.json                  # Root runner scripts
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### Step 1: Install Dependencies

From the project root:
```bash
npm run install-all
```
*(Or navigate to `backend/` and run `npm install`, then to `frontend/` and run `npm install`)*

---

### Step 2: Environment Configuration

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/disaster_relief
JWT_SECRET=disaster_relief_jwt_secret_key_super_secure_2025
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Run the Application

You can start both servers simultaneously with a single root command:
```bash
npm run dev
```

Or run them individually in separate terminal windows:
- **Terminal 1 (Backend):**
  ```bash
  cd backend
  npm run dev
  ```
  *Backend will start on: `http://localhost:5000`*

- **Terminal 2 (Frontend):**
  ```bash
  cd frontend
  npm run dev
  ```
  *Frontend will open on: `http://localhost:5173`*

---

## 🗄️ Database Setup (Local or MongoDB Atlas)

### Option A: Zero-Config Instant Mode (Works Out-of-the-Box)
The backend features an **automatic graceful fallback**. If a local MongoDB instance is not detected, the system boots immediately in fast in-memory mode preloaded with realistic Chennai disaster relief records. **No manual database installation is required for instant evaluation and demo!**

### Option B: MongoDB Atlas Free Cloud Cluster (Permanent Persistence)
1. Visit [MongoDB Atlas](https://cloud.mongodb.com) and create a free M0 cluster.
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, add IP `0.0.0.0/0` (allow from anywhere).
4. Click **Connect** → **Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/disaster_relief?retryWrites=true&w=majority
   ```
5. Paste this into `backend/.env` as `MONGODB_URI`.
6. Run the database seed script:
   ```bash
   npm run seed
   ```

---

## 🔑 Demo Credentials (Password for All: `Password123!`)

For presentation convenience, the top navigation bar features a **1-Click Demo Role Switcher** to test different roles instantly without manual re-login:

| Role | Email Address | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@example.com` | `Password123!` | Report emergencies, Leaflet GPS coordinates, track responder |
| **NGO** | `ngo@example.com` | `Password123!` | Browse incident grid, claim emergencies, dispatch aid |
| **Volunteer** | `volunteer@example.com` | `Password123!` | Update field progress, mark tasks In Progress & Resolved |
| **Government** | `government@example.com` | `Password123!` | Live tactical map, coverage deficit gaps, allocate stockpiles |
| **Admin** | `admin@example.com` | `Password123!` | User governance, audit logs, duplicate review |

---

## 🌐 REST API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Public account registration (Citizen, NGO, Volunteer)
- `POST /api/auth/login` - Sign in and receive JWT token
- `GET /api/auth/me` - Retrieve current logged-in profile

### Emergency Requests
- `POST /api/requests` - Submit emergency (calculates rule-based priority & checks duplicates)
- `GET /api/requests` - Filter requests by category, priority, status, or proximity duplicates
- `GET /api/requests/:id` - Detailed incident overview with coordinates and responder info
- `POST /api/requests/:id/claim` - Atomic claiming (protected against race conditions)
- `POST /api/requests/:id/status` - Transition status (`IN_PROGRESS`, `RESOLVED`)

### Government & Intelligence
- `GET /api/dashboard/stats` - Multi-agency operational statistics
- `GET /api/dashboard/coverage` - Rule-based geographic cluster gap analysis
- `GET /api/dashboard/map` - Geospatial coordinates for Leaflet tactical pins

### Stockpile Resources
- `GET /api/resources` - List relief inventories and dispatches
- `POST /api/resources` - Register inventory pool (Government/Admin)
- `POST /api/resources/:id/allocate` - Safe allocation to an active emergency

### Administration & Audit
- `GET /api/users` - User directory with role filter
- `PUT /api/users/:id/role` - Elevate or modify account privileges
- `PUT /api/users/:id/status` - Activate or deactivate user credentials
- `GET /api/activity` - Immutable chronological audit trail

---

## 🔮 Future Architecture Concepts
- **SMS Gateway Fallback**: Integrating GSM/SMS webhook relays for non-smartphone citizens in rural blackout zones.
- **Service Worker Tile Caching**: Offline map tiles for field laptops via IndexedDB.
- **Drone Video Streams**: Direct video telemetry integration for aerial flood assessment.

---

## 📄 License
This project is open-source and available under the ISC License.
