# BuggedBrain - Next-Gen Recruitment & Preparation Ecosystem

BuggedBrain is a premium recruitment and interview preparation platform built for the modern student. It bridges the gap between opportunities and readiness through personalized roadmaps, interactive checklists, and a high-fidelity marketplace.

## 🚀 Core Features

- **Personalized Roadmap System**: An intelligent onboarding flow creates tailored learning paths based on your role, level, and specific career goals.
- **Interactive Preparation Checklist**: Each recruitment drive comes with a specialized checklist to ensure you are 100% prepared before applying.
- **Elite Placement Preparation**: A premium "Clearance" section providing restricted, high-tier resources for top-shelf company interviews.
- **Smart Drive Marketplace**: Integrated search, filtering, and video company insights for a streamlined discovery experience.
- **Admin Command Center**: Secure panel for managing drives, resources, and student engagement.
- **Identity Profile & Mission Log**: Track your application history and manage your platform clearance levels in a unified dashboard.
- **Premium UI**: Dark-mode primary, high-fidelity design inspired by high-end tech ecosystems like Stripe and Linear.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Lucide Icons, React Markdown.
- **Backend**: Node.js, Express, Multer (File Uploads), JWT (Authentication).
- **Database**: SQLite (built with `better-sqlite3`).

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup Instructions

1. **Clone and Install Backend**:
   ```bash
   cd server
   npm install
   ```

2. **Initialize Database**:
   ```bash
   node src/seed.js
   ```
   *Note: This creates an admin user and sample drives.*

3. **Clone and Install Frontend**:
   ```bash
   cd ../client
   npm install --legacy-peer-deps
   ```

### Running Locally

1. **Start Backend Server**:
   ```bash
   cd server
   npm start # or node src/index.js
   ```
   Server runs on `http://localhost:5000`.

2. **Start Frontend Client**:
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`.

---

## 🔐 Credentials

- **Admin Login**: `admin@buggedbrain.com` / `admin123`
- **Student Login**: Register via the "Get Started" button or use any registered student account.

---

## 📂 Project Structure

```
/client       # React frontend
  /src
    /components  # Reusable UI elements
    /context     # Auth state management
    /pages       # Page components
/server       # Express backend
  /src
    /db          # SQLite configuration
    /middleware  # Auth and validation
    /routes      # API endpoints
  /uploads       # PDF and Logo storage
```

---

## 🔭 Future Horizons (Upgrade Suggestions)

- **AI Career Concierge**: Integrate Gemini API for real-time resume analysis and personalized career advice based on the Roadmap.
- **Dynamic Interview Simulator**: Implement a voice/text AI interviewer tailored specifically to the company's past interview patterns (Google, AWS, etc.).
- **Peer Preparation Hub**: Live preparation rooms where students can collaborate on checklists and share interview experiences.
- **Placement Readiness Score (PRS)**: A data-driven score calculating a student's probability of success based on roadmap completion and kit downloads.
- **Real-time Mission Alerts**: WebSocket or push-notification integration to alert students the moment a matching drive goes live.
- **Infrastructure Scaling**: Migration to PostgreSQL and AWS S3 for production-ready data and asset management.
