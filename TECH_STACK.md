# Project Technology Stack

This document outlines the key technologies and libraries used in the development of this project, categorized by the Backend and Frontend components.

## ⚙️ Backend Data & Server (Node.js/Express)

The backend is structured as a REST API built with Node.js and Express, connected to a MongoDB database.

*   **[Express](https://expressjs.com/) (`express`)**: The core minimalist web framework used to build the RESTful API routes, handle requests and responses, and manage middleware.
*   **[Mongoose](https://mongoosejs.com/) (`mongoose`)**: An elegant MongoDB object modeling tool. It provides a schema-based solution to model the application data, complete with type casting, validation, query building, and business logic hooks.
*   **[JSON Web Token](https://jwt.io/) (`jsonwebtoken`)**: Used for stateless authentication and authorization. After a user logs in, a JWT is generated and sent to the client, which is then used to securely verify the user's identity on subsequent requests.
*   **[Bcrypt.js](https://www.npmjs.com/package/bcryptjs) (`bcryptjs`)**: A library to securely hash and salt user passwords before storing them in the database, ensuring passwords are not saved in plaintext.
*   **[Multer](https://github.com/expressjs/multer) (`multer`)**: Middleware for handling `multipart/form-data`. It is primarily used for managing file uploads within the application (e.g., attaching files/images to tickets).
*   **[Nodemailer](https://nodemailer.com/) (`nodemailer`)**: A module used for sending emails from the Node.js server. This is utilized for features like user registration verification and system notifications.
*   **[Socket.IO](https://socket.io/) (`socket.io`)**: Enables real-time, bidirectional, and event-based communication between the server and clients. It powers features like live real-time notifications or chat capabilities.
*   **Security & Utilities**:
    *   **Helmet (`helmet`)**: Secures the Express app by setting various standard HTTP headers.
    *   **CORS (`cors`)**: Middleware to enable Cross-Origin Resource Sharing, allowing the frontend domain to communicate securely with the backend API.
    *   **Dotenv (`dotenv`)**: Loads environment variables from a `.env` file into `process.env`, keeping secrets (like database URLs and JWT secrets) out of the codebase.
    *   **Morgan (`morgan`)**: An HTTP request logger middleware used for monitoring API traffic and debugging.

## 🎨 Frontend Client (React)

The frontend is a single-page application (SPA) built with React, styled with Tailwind CSS, and configured with Vite.

*   **[React](https://react.dev/) (`react`, `react-dom`)**: The foundational JavaScript library used for building interactive and component-driven user interfaces.
*   **[Vite](https://vitejs.dev/) (`vite`)**: A lightning-fast build tool and development server that provides near-instant Hot Module Replacement (HMR) for a smooth developer experience.
*   **[React Router](https://reactrouter.com/) (`react-router-dom`)**: Handles navigation and declarative routing within the React application, enabling a seamless single-page experience without browser reloads.
*   **[Tailwind CSS](https://tailwindcss.com/) (`tailwindcss`, `postcss`, `autoprefixer`)**: A highly customizable utility-first CSS framework used for rapid, responsive UI styling directly within JSX.
*   **[Zustand](https://github.com/pmndrs/zustand) (`zustand`)**: A small, fast, and scalable state-management solution. It handles global state across the app, such as managing the user's authentication context and module data (e.g., helpdesk tickets).
*   **[Axios](https://axios-http.com/) (`axios`)**: A promise-based HTTP client used to make structured asynchronous API requests from the frontend to the backend REST API.
*   **[Framer Motion](https://www.framer.com/motion/) (`framer-motion`)**: A production-ready motion library for React. It is used to implement sophisticated, declarative, and fluid animations to create a premium UI experience.
*   **[Socket.IO Client](https://socket.io/) (`socket.io-client`)**: The frontend counterpart to the backend Socket.IO server, establishing a stable WebSocket connection for listening to and emitting real-time events.
*   **[Lucide React](https://lucide.dev/) (`lucide-react`)**: A comprehensive library of beautifully crafted open-source SVG icons used throughout the user interface.
*   **Code Quality**:
    *   **ESLint (`eslint`)**: A pluggable linting utility to find and fix patterns in the JavaScript/JSX code.
