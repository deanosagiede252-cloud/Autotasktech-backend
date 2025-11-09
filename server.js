/**
 * Root entrypoint for Render (or any process manager).
 * - Keeps repository root empty (no static root wiring).
 * - Loads environment, connects DB, and starts the HTTP server.
 * - Imports the configured Express `app` from ./src/server.js (which only defines the app).
 *
 * Usage:
 * - Ensure package.json has "type": "module" (or use .mjs).
 * - Start with: node server.js  (or set Render start command to `node server.js`)
 */

import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app, { connectMongo } from "./src/server.js";

const PORT = Number(process.env.PORT || 5000);
const NODE_ENV = process.env.NODE_ENV || "development";
const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000);

async function start() {
  try {
    // Connect to MongoDB first so the app won't start in a bad state
    await connectMongo();
  } catch (err) {
    console.error("Failed to connect to MongoDB, exiting.", err);
    process.exit(1);
  }

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (env: ${NODE_ENV})`);
  });

  // Graceful shutdown
  let shuttingDown = false;
  const gracefulShutdown = (signal) => async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}. Shutting down gracefully...`);

    server.close(async (err) => {
      if (err) {
        console.error("Error closing HTTP server:", err);
        process.exit(1);
      }
      try {
        // disconnect mongoose (handled in src/server.js)
        await (await import("mongoose")).disconnect();
        console.log("✅ MongoDB connection closed");
        console.log("Closed out remaining connections. Exiting.");
        process.exit(0);
      } catch (e) {
        console.error("Error during shutdown:", e);
        process.exit(1);
      }
    });

    setTimeout(() => {
      console.warn("Forcing shutdown after timeout");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();
  };

  process.on("SIGTERM", gracefulShutdown("SIGTERM"));
  process.on("SIGINT", gracefulShutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection at:", reason);
    setTimeout(() => process.exit(1), 1000).unref();
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception thrown:", err && err.stack ? err.stack : err);
    setTimeout(() => process.exit(1), 1000).unref();
  });
}
