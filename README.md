# 🎓 NEXUS Edu — Smart University Management System

A full-stack ERP/LMS/CRM platform for universities built with **Flask + React + SQLite**.

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Python 3.9+
- Node.js 18+ (only needed if you want to modify the frontend)

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Adarshkatara/gen-ai-project.git
cd gen-ai-project
```

### Step 2 — Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3 — Initialize the Database
```bash
python init_db.py
```
> This creates `smart_college.db` with all tables and sample data.

### Step 4 — Run the Server
```bash
python app.py
```

Open your browser at **http://127.0.0.1:5000**

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.com | admin123 |
| Faculty | faculty@college.com | fac123 |
| Student | student@college.com | stu123 |

---

## 🗂️ Project Structure

```
gen-ai-project/
├── app.py                    # Flask backend (all API routes)
├── schema.sql                # Database schema + seed data
├── init_db.py                # DB initialization script
├── requirements.txt          # Python dependencies
├── templates/
│   ├── index.html            # Landing page (marketing)
│   ├── login.html            # Authentication page
│   └── react_student.html    # Shell for React SPA
├── static/
│   ├── style.css             # Global stylesheet
│   ├── landing.css           # Landing page premium styles
│   ├── script.js             # Vanilla JS for login/register
│   └── react_dist/           # Pre-built React assets (served by Flask)
└── student-dashboard/
    └── frontend/             # React + Vite source (for development)
```

---

## ✨ Features

- **Student Portal** — Attendance, fees, exams, timetable, advisor connect, online classes
- **Faculty Dashboard** — Mark attendance, upload materials, grade assignments
- **Admin ERP** — Full user/course/fee/results management, audit logs, announcements
- **Admin Portal Switcher** — Admin can simulate Student/Faculty views
- **Real-Time Notifications** — Toast popups & live polling every 5 seconds
- **Persistent Login** — Browser saves credentials after first login
- **University Application Form** — CRM lead capture with Name, DOB, GPA, Major

---

## 🛠️ Frontend Development (Optional)

The React app is pre-built and served from `static/react_dist/`. You only need Node.js if you want to modify the React source.

```bash
cd student-dashboard/frontend
npm install
npm run dev        # development server (port 5173)
npm run build      # rebuild production assets
```

After building, copy `dist/assets/*` to `static/react_dist/assets/` and update the hash references in `templates/react_student.html`.
