# Engineering Resource Management System (ERMS)

A full-stack app to manage engineering team assignments, capacity, and projects.

---

## Features
- Authentication (Manager & Engineer roles)
- Engineer & Project management
- Assignment system with capacity tracking
- Manager & Engineer dashboards
- Modern UI (React + Tailwind + ShadCN UI)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Engineering_Resource_Management_System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Create `.env` file in `backend/`:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

#### Seed the Database (optional, for demo data)
```bash
node seed.js
```

#### Start the Backend
```bash
node server.js
```

---

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### Update API URL (if deploying backend)
Edit `src/services/api.ts`:
```ts
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

#### Start the Frontend
```bash
npm run dev
```

---

## Deployment Notes
- **Backend:** Deploy `/backend` folder (e.g., Render, Railway)
- **Frontend:** Deploy `/frontend` folder (e.g., Vercel, Netlify)
- Use MongoDB Atlas for cloud database

---

## Demo Accounts
- **Manager:** lisa@company.com / password123
- **Engineers:** john@company.com, sarah@company.com, mike@company.com / password123

---

## AI Usage
- Used AI tools (Cursor, ChatGPT) for code generation, refactoring, and troubleshooting.
- All code was reviewed, tested, and adapted for this project.
