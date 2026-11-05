# Task Manager (MERN + TypeScript)

A clean, full-stack Task Management application built as a hands-on project to practice and master **TypeScript across the entire MERN stack** (MongoDB, Express, React, Node.js).

---

## 🎯 Project Purpose

This project was built to practice end-to-end type safety in full-stack web development:
- Modeling database documents using **Mongoose & TypeScript**.
- Typing **Express** route handlers, request parameters, bodies, and custom headers.
- Building type-safe **React** components, props, hooks, and API interactions.
- Integrating **Tailwind CSS** for modern UI design.
- Implementing client-isolated task lists using persistent browser UUIDs without full auth overhead.

---

## ✨ Features

- **Full CRUD Operations**: Create, read, toggle completion, and delete tasks.
- **Client-Side Privacy**: Generates and persists an anonymous UUID in browser `localStorage` (`x-user-id`), ensuring each visitor sees only their own tasks.
- **Modern UI**: Styled with Tailwind CSS, featuring ambient lighting, smooth micro-interactions, responsive cards, and live stats.
- **Self-Ping Keep-Alive**: Includes an automated 14-minute self-ping mechanism to prevent Render free-tier instances from idling.
- **End-to-End TypeScript**: Strong typing from MongoDB schemas through Express APIs down to React components.

---

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**

### Backend
- **Node.js**
- **Express 5**
- **TypeScript** (`tsx` runtime)
- **Mongoose 9**
- **MongoDB Atlas** (Cloud Database)

---

## 📁 Project Structure

```text
Basic-Task-Manager/
├── client/                     # Frontend React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── NewTask.tsx     # Task creation form & validation
│   │   │   └── TaskList.tsx    # Task items list & actions
│   │   ├── App.tsx             # Main dashboard & API integration
│   │   ├── config.ts           # Dynamic API base URL configuration
│   │   ├── types.ts            # Shared TypeScript interfaces
│   │   └── user.ts             # LocalStorage UUID helper
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── models/
│   │   │   └── Task.ts         # Mongoose schema & model with TypeScript
│   │   ├── server.ts           # Express server, routes & keep-alive
│   │   └── task.ts             # Validation helpers & types
│   ├── package.json
│   └── .env                    # (Ignored) Database URI & port
│
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) connection string (or local MongoDB)

---

### 1. Backend Setup

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `server/` folder:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string_here
   # Optional for local development:
   # BACKEND_URL=http://localhost:3000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will be running at `http://localhost:3000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file in `client/` if your backend runs on a different port:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment (Render)

- **Backend**: Deployed as a **Render Web Service** (Node environment, root directory `server`, start command `npm start`).
- **Frontend**: Deployed as a **Render Static Site** (Root directory `client`, build command `npm install && npm run build`, publish directory `dist`).
- **Environment Variables**:
  - Backend: `MONGODB_URI`, `CLIENT_URL`, `BACKEND_URL`
  - Frontend: `VITE_API_URL`

