import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import setupSocket from "./socket/socket.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); // This is crucial to parse JSON bodies!
app.use(express.urlencoded({ extended: true })); 

const server = http.createServer(app);

// Initialize WebSocket and store `io`
const io = setupSocket(server);
console.log("JWT_SECRET:", process.env.JWT_SECRET);


mongoose.set('debug', true);

// Add error handling for uncaught exceptions
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://theskillswap.netlify.app", // Allow only this origin
    credentials: true, // Allow cookies and authentication headers
  })
);




// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/progress", progressRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: process.memoryUsage().heapUsed / 1024 / 1024
  });
});

// Error Handling Middleware


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
