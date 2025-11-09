// Import dependencies
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes (direct files — not inside a /routes folder)
import authRoutes from "./auth.js";
import userRoutes from "./User.js";
import walletRoutes from "./Wallet.js";
import strategyRoutes from "./Strategy.js";
import chatRoutes from "./chat.js";
import clRoutes from "./cl_index.js";

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/strategy", strategyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/cl", clRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("AutoTask Backend is running successfully 🚀");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
