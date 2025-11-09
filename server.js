// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// 🧱 Security & Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// 🧩 Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// 🧠 Import Routes
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallet.js";
import strategyRoutes from "./routes/strategy.js";
import clRoutes from "./routes/cl.js";
import chatRoutes from "./routes/chat.js";

// 🛠 Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/strategy", strategyRoutes);
app.use("/api/cl", clRoutes);
app.use("/api/chat", chatRoutes);

// 🩺 Health Check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// 🌍 Root Route
app.get("/", (req, res) => {
  res.send("🚀 AutoTask Backend is running successfully");
});

// 🧭 Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
