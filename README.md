# Chameli Devi Group of Institutions - Campus Help Desk System

A premium, high-contrast, scalable Support Portal designed to route, monitor, and resolve academic, administrative, and infrastructural requests with unparalleled speed.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![UI](https://img.shields.io/badge/UI-Tailwind%20CSS%20+%20Framer-black?style=for-the-badge)

## 📌 Project Architecture
This system is composed of an intelligently decoupled frontend and backend seamlessly connected via RESTful API routing and custom JSON Web Tokens (JWT) for secure scaling.

* **Frontend:** React + Vite + Tailwind CSS + Framer Motion (Real-time reactive components)
* **Backend:** Node.js + Express.js + Mongoose
* **Database:** MongoDB
* **State Management:** Zustand (Handling cross-component lifecycles)
* **Storage:** Multer (Native static file parsing for images)

## ✨ Core Functionalities

### 🔒 Enterprise Role-Based Operations
* **Strict Interface Toggling:** The interface layout physically restructures based on the User's JWT scope (`student` vs `staff`). 
* **Granular Ownership:** Users only maintain CRUD (Create, Read, Update, Delete) permissions over database entities they directly own preventing administrative overlap.

### 🎫 Socket-Driven Ticketing
* Enables students to deploy specific queries directly to administrative dashboards. Staff interfaces intercept these tickets globally to organize resolution pipelines (`Open` -> `In Progress` -> `Resolved`).

### 📰 Public Notice Board
* A modernized announcement architecture bypassing traditional emails. Authorized personnel can upload image metrics mapped directly to the server's static directory.

## 🚀 Quick Start / Local Setup

Ensure you have Node.js and MongoDB running before starting the servers.

### 1. Database Configuration
Inside the `/backend` folder, create a `.env` file detailing your environment protocols:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_string
JWT_SECRET=your_super_secret_key_123
```

### 2. Bootstrapping the Server
Start up the Express interface.
```bash
cd backend
npm install
npm start
```
*The server will spin up on Port 5000.*

### 3. Assembling the Client
Open a secondary terminal window to compile the React interface.
```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173/` in your browser. The system will detect unauthenticated requests and automatically route you to the dynamic Landing environment.
