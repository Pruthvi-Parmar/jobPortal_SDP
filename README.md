# JobConnect

JobConnect is a full-fledged job portal application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with advanced features for job seekers, recruiters, and admins. It facilitates real-time job posting, application tracking, recruiter-applicant messaging, AI assistance, resume analysis, premium memberships, and an admin dashboard for managing the platform.

[JobConnect Live 🚀](https://jobconnect.iampruthvi.tech/)

## ✅ Features

### For Job Seekers:

* Sign up/login with JWT & Google Authentication
* Browse and apply for jobs
* Upload resumes
* View application status
* Chat with recruiters (Premium only)
* AI resume analyzer

### For Recruiters:

* Register/login securely
* Post, edit, delete jobs
* View applicants per job
* Chat with job seekers (Premium only)
* Accept/Reject applications

### For Admin:

* Manage users (job seekers and recruiters)
* Monitor job postings and activity
* Analytics Dashboard

### General:

* Real-time notifications
* Responsive UI (Mobile & Desktop)
* Email notifications (application status updates)
* Role-based access

---

## 🛠 Tech Stack

### Frontend:

* React.js
* TailwindCSS + ShadCN UI
* Redux Toolkit
* Axios

### Backend:

* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (for file uploads)
* Socket.IO (chat)
* Google Gemini API (AI)
* Razorpay (Payments)

### Other Tools:

* Nodemailer
* React Router DOM
* Passport.js (Google Auth)

---

## 📁 Project Structure (Key Folders)

```
jobconnect/
├── client/                  # React frontend
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── App.jsx
│
├── server/                  # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── app.js
```

---

## 🚀 Installation

```bash
# 1. Clone repo
$ git clone https://github.com/Pruthvi-Parmar/jobPortal_SDP.git && cd jobconnect

# 2. Install dependencies
$ cd client && npm install
$ cd ../server && npm install

# 3. Environment variables
Create `.env` files in respective folders (client, server, socket-server)

# 4. Start dev servers
# Terminal 1 (Frontend)
$ cd client && npm run dev

# Terminal 2 (Backend)
$ cd server && npm run dev

```

---

## 🔐 Environment Variables

### Server (`.env`)

```
PORT=8081
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET=your_key_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Client (`.env`)

```
VITE_BACKEND_URL=http://localhost:8081
VITE_SOCKET_URL=http://localhost:3001
```

---

## 📡 API Overview

### Auth APIs:

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/google/callback`

### Job APIs:

* `POST /jobs/`
* `GET /jobs/`
* `GET /jobs/:id`
* `POST /jobs/apply/:jobId`

### Admin APIs:

* `GET /admin/users`
* `DELETE /admin/job/:jobId`

### AI APIs:

* `POST /ai/analyze-resume`
* `POST /ai/chat`

### Payment APIs:

* `POST /payments/create-order`
* `POST /payments/verify`

---

## 💳 Premium Membership & Payments

* Razorpay integration
* Only premium users can access:

  * Resume analyzer
  * Recruiter chat
  * Priority application support
* Frontend flow integrated using Razorpay Checkout

---

## 💬 Real-Time Chat

* WebSockets using Socket.IO
* Authenticated with JWT
* Redux-based message storage on client
* Job-based chat rooms

---

## 🤖 AI Chatbot & Resume Analyzer

* Integrated via Google Gemini API
* Chatbot: General assistant + Job query handler
* Resume Analyzer:

  * Upload resume PDF
  * Analyze for specific job role match
  * Shows skill match, suggestions

---

## 🛡 Admin Panel

* Standalone admin login with JWT
* View all users and recruiters
* Approve/Reject jobs
* View analytics: job stats, active users, etc.
* Admin DB managed via Prisma + NeonDB

---

## 🔮 Future Scope

* Mobile App (React Native)
* Video Interview Scheduling
* AI Job Recommendation Engine
* Resume Builder with Templates
* Multi-language support
* Dark mode & Theme customization

---

## 📝 License

MIT License. Feel free to fork, improve, and use in your projects!

---

## 🙌 Contribution

Open for contributions. Create a PR or raise an issue.

---

## 👨‍💻 Authors

* [Pruthviraj Parmar](https://github.com/Pruthvi-Parmar)
* [Sumit Mishra](https://github.com/sm-xd)

> Built with ❤️ by Pruthvi and Sm
