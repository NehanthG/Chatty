import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { connectDB } from "./lib/db.js";
import { app as socketApp, server, io } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;

// Middlewares
socketApp.use(express.json({ limit: "10mb" }));
socketApp.use(express.urlencoded({ limit: "10mb", extended: true }));
socketApp.use(cookieParser());
socketApp.use(
  cors({
    origin: process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "*",
    credentials: true,
  })
);

// API routes
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  
  // Serve static files
  socketApp.use(express.static(frontendPath));

  // Catch-all route
  socketApp.get('/:path(*)', (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start server
server.listen(PORT, async () => {
  console.log("Server running on port " + PORT);
  await connectDB();
});
