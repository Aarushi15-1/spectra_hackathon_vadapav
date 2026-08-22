# HealthBridge LabConnect Frontend

Modern React + Vite frontend for the **HealthBridge LabConnect** laboratory management module.

## Features
- **Real-Time Spring Boot Health Indicator:** Connects to `http://localhost:8080/api/health` and displays a live connection status pill with automatic retry/polling.
- **Responsive Dashboard:** Displays lab metrics, order lifecycle pipeline status, and recent activity.
- **Module Views:** Includes navigation for:
  - **Dashboard Overview**
  - **Patients Directory**
  - **Diagnostic Test Catalog**
  - **Lab Reports & Verification**
  - **Partner Laboratories**
  - **Sample Collection Appointments**
  - **User Profile & API Settings**

---

## Prerequisites
- **Node.js**: v18+ or v20 LTS
- **Spring Boot Backend**: Running on `http://localhost:8080`

---

## Setup & Running the Frontend

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will launch at:
`http://localhost:5173`

---

## Environment Configuration

By default, the frontend points to the Spring Boot backend at `http://localhost:8080`.
You can customize the API base URL in `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:8080
```
