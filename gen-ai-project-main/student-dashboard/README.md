# Full Stack Student Dashboard

This is a complete MERN stack (MongoDB, Express, React, Node.js) Web Application tailored perfectly to replicate a Modern University ERP System.

## Features
- **Frontend**: Built with React.js, Tailwind CSS, Lucide Icons, and React Router.
- **Backend**: Built with Node.js, Express, and JWT Authentication.
- **Database**: MongoDB with Mongoose Models.
- **Modules**: Includes User Registration/Login, Timetable, Dynamic Subject Loading, and Circular Attendance scaling.

## Folder Structure

```
student-dashboard/
│
├── backend/                  # Express REST API
│   ├── models/               # Mongoose Data Schemas (User, Attendance, Timetable, Subject)
│   ├── routes/               # Express Router logic
│   ├── .env                  # Environment Variables
│   ├── server.js             # API Entry Point
│   ├── seed.js               # Database population script
│   └── package.json
│
└── frontend/                 # Vite + React Interface
    ├── src/
    │   ├── components/       # Reusable UI widgets
    │   ├── context/          # React Auth Context
    │   ├── pages/            # Login and Dashboard pages
    │   ├── App.jsx           # App Routing
    │   ├── index.css         # Tailwind Entry
    │   └── main.jsx          # React DOM entry
    ├── tailwind.config.js    # Tailwind layout options
    └── package.json
```

## Step-by-Step Run Instructions

### 1. Prerequisite Setup
Ensure that **Node.js** and **MongoDB** are installed and running locally on your computer.

### 2. Configure Backend
Open a terminal in the `backend` directory:
```bash
cd student-dashboard/backend
```

Run the backend dependencies:
```bash
npm install
```

Seed your MongoDB automatically with dummy accounts and academic data:
```bash
node seed.js
```

Start the Backend Server (it will run on port 5000):
```bash
node server.js
```

### 3. Configure Frontend
Open a **new** terminal window matching your OS in the `frontend` directory:
```bash
cd student-dashboard/frontend
```

Run the frontend dependencies:
```bash
npm install
```

Start your React application in development mode:
```bash
npm run dev
```

### 4. Logging In
Navigate to `http://localhost:5173` in your browser.
Use the following test credentials created by the `seed.js` script:

**Student Login:**
- Email: `student@university.edu`
- Password: `student123`

**(SuperUser) Admin Login:**
- Email: `admin@university.edu`
- Password: `admin123`
