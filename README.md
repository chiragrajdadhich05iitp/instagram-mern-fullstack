# Instagram Clone - Production Grade MERN Social Platform

A fullstack, production-grade social media platform mirroring the desktop Instagram experience. Built using MongoDB Atlas, Express, React (Vite), Node.js, and Socket.io for low-latency, real-time messaging.

---

## 🌟 Key Features

* **Feed & Engagements:** Instant post creation, like/unlike toggling, real-time comment threads, and saved bookmarks.
* **Real-time 1-on-1 Direct Messaging (DM):** Built using WebSockets (Socket.io) for peer-to-peer live chat without page refresh.
* **Stories Player Modal:** Top-level story rings with an animated timer progression viewer.
* **Reels Experience:** Vertical video player feed with interactive engagement controls and audio toggles.
* **Explore Grid:** High-density 3x3 discovery layout with smooth hover stats overlays.
* **Dynamic Profile Management:** Post grid, saved collections, followers/following counters, and user credentials.
* **Secure JWT Authentication:** Token-based protected endpoints with demo auto-login integration.

---

## 🛠 Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Lucide React icons, Axios, Socket.io-client
* **Backend:** Node.js, Express.js, Socket.io, JSON Web Tokens (JWT), Bcrypt.js
* **Database:** MongoDB Atlas (Cloud) via Mongoose ODM

---

## 📁 Repository Structure

```text
insta-clone/
├── backend/
│   ├── config/             # Database connection logic
│   ├── controllers/        # Route logic (Auth, Posts, Messages)
│   ├── middlewares/        # JWT Authentication verification
│   ├── models/             # Mongoose Schemas (User, Post, Message)
│   ├── routes/             # REST API endpoint definitions
│   ├── .env                # Environment secrets (Protected)
│   ├── seed.js             # Initial database mock seed script
│   └── server.js           # Express app & Socket.io server entry
│
├── frontend/
│   ├── src/
│   │   ├── api.js          # Pre-configured Axios instance with JWT interceptor
│   │   ├── App.jsx         # Core layout, tab manager, feeds, and modals
│   │   ├── ChatModal.jsx   # Dedicated Socket.io real-time chat interface
│   │   ├── index.css       # Core stylesheets
│   │   └── main.jsx        # React root renderer
│   ├── index.html          # HTML entry & Tailwind engine
│   └── vite.config.js      # Vite configuration
│
└── README.md

```

---

## 🚀 Getting Started Locally

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Git](https://git-scm.com/)
* MongoDB Atlas connection URI

---

### 1. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="your_jwt_secret_key"

```

Seed initial data and start the backend server:

```bash
# Seed initial mock users and posts
node seed.js

# Launch the server (HTTP + Socket.io)
node server.js

```

Backend will be running on `http://localhost:5000`.

---

### 2. Frontend Setup

Open a separate terminal window:

```bash
cd frontend
npm install
npm run dev

```

Visit the displayed local port (typically `http://localhost:5173` or `http://localhost:5174`) in your browser.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | User login & token generation | Public |
| `GET` | `/api/v1/posts/all` | Fetch global feed posts | Public |
| `POST` | `/api/v1/posts/create` | Upload post with media URL & caption | Protected |
| `PUT` | `/api/v1/posts/like/:id` | Like or unlike a specific post | Protected |
| `POST` | `/api/v1/posts/comment/:id` | Post a comment on a specific item | Protected |
| `GET` | `/api/v1/messages/:otherUserId` | Fetch historical 1-on-1 chat history | Protected |
| `POST` | `/api/v1/messages/send` | Send direct message and trigger socket | Protected |

---

## 🛡 Security & Best Practices

* Sensitive credentials (`MONGO_URI`, `JWT_SECRET`) are kept isolated in `.env` and ignored via `.gitignore`.
* Passwords are salted and hashed using `bcrypt` before storage.
* Protected endpoints enforce strict Bearer token authentication via Express middleware.
