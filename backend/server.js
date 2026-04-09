import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { Article } from "./models/Article.js";
import { User } from "./models/User.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import kbRoutes from "./routes/kbRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to MongoDB and then seed if empty
connectDB().then(async () => {
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      const adminOrStaff = await User.findOne({ role: { $in: ["admin", "staff"] } });
      if (adminOrStaff) {
        await Article.insertMany([
          { 
            title: "How to connect to Campus WiFi", 
            content: "To connect to the campus wifi securely, select 'Campus-Secure' from your network list and authenticate with your main Student credentials.", 
            category: "IT", 
            author: adminOrStaff._id 
          },
          { 
            title: "Accessing Software Licenses", 
            content: "Students get free access to Adobe Creative Cloud and Microsoft Office 365. Visit the student portal -> Software center to claim your keys.", 
            category: "IT", 
            author: adminOrStaff._id 
          },
          { 
            title: "Library Operating Hours", 
            content: "The main studying library is open from 8 AM to 10 PM on weekdays, and 9 AM to 6 PM on weekends.", 
            category: "Academic", 
            author: adminOrStaff._id 
          }
        ]);
        console.log("✅ Seeded initial Knowledge Base articles.");
      }
    }
  } catch (error) {
    console.log("Error seeding database: ", error.message);
  }
});

const app = express();

// Secure headers
app.use(helmet());

// CORS configuration - allowing typical Vite development ports
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "your-domain.com" 
      : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);

// Expose the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __frontendDir = path.join(__dirname, "../frontend/dist");
  app.use(express.static(__frontendDir));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__frontendDir, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Setup Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("join-ticket", (ticketId) => {
    socket.join(ticketId);
    console.log(`Socket ${socket.id} joined ticket ${ticketId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Export io for use in controllers
export const getIo = () => io;

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
