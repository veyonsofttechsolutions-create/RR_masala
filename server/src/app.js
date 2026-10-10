import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

import auth from "./routes/auth.js";
import products from "./routes/products.js";
import categories from "./routes/categories.js";
import cart from "./routes/cart.js";
import orders from "./routes/orders.js";
import users from "./routes/users.js";
import dashboard from "./routes/dashboard.js";
import adminMisc from "./routes/adminMisc.js";
import wishlist from "./routes/wishlist.js";
import payments from "./routes/payments.js";

import {
  notFound,
  errorHandler,
} from "./middleware/error.js";

const app = express();

app.set("trust proxy", 1);

// ==========================================
// SECURITY HEADERS
// ==========================================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = new Set([
  ...env.clientUrls,

  // Production frontend
  "https://rr-masala-ten.vercel.app",

  // Production API domain
  "https://rr-masala-1j1r.vercel.app",

  // Local development frontends
  "http://localhost:5173",
  "http://localhost:5174",
]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);

      return callback(
        new Error(`CORS origin not allowed: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],

    optionsSuccessStatus: 204,
  })
);

// ==========================================
// REQUEST BODY PARSING
// ==========================================

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

// ==========================================
// COOKIES
// ==========================================

app.use(cookieParser());

// ==========================================
// REQUEST LOGGING
// ==========================================

app.use(morgan("dev"));

// ==========================================
// RATE LIMITING
// ==========================================

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", async (req, res) => {
  console.log("MongoDB environment diagnostic:", {
  hasMongoUri: Boolean(process.env.MONGODB_URI),
  mongoUriLength: process.env.MONGODB_URI?.length || 0,
  vercelEnvironment: process.env.VERCEL_ENV || "unknown",
  vercelRegion: process.env.VERCEL_REGION || "unknown",
});
  try {
    // Establish MongoDB connection if not connected
    await connectDB();

    // Verify that MongoDB responds
    if (!mongoose.connection.db) {
      throw new Error(
        "MongoDB connection exists, but database handle is unavailable."
      );
    }

    await mongoose.connection.db.admin().ping();

    return res.status(200).json({
      success: true,
      api: "online",
      database: "connected",
      databasePing: "success",
      readyState: mongoose.connection.readyState,
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check database failure:", {
      name: error.name,
      message: error.message,
      readyState: mongoose.connection.readyState,
    });

    return res.status(503).json({
      success: false,
      api: "online",
      database: "disconnected",
      readyState: mongoose.connection.readyState,
      errorName: error.name || "DatabaseConnectionError",
      error: error.message || "Unknown MongoDB connection error",
      time: new Date().toISOString(),
    });
  }
});

// ==========================================
// DATABASE CONNECTION MIDDLEWARE
// ==========================================

// Ensure MongoDB is connected before processing API routes.
// The health endpoint above handles its own connection check.

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error("API database connection failed:", {
      path: req.originalUrl,
      name: error.name,
      message: error.message,
      readyState: mongoose.connection.readyState,
    });

    return res.status(503).json({
      success: false,
      code: "DATABASE_CONNECTION_FAILED",
      message: "Unable to connect to the database.",
      errorName: error.name || "DatabaseConnectionError",
      error: error.message || "Unknown MongoDB connection error",
      readyState: mongoose.connection.readyState,
      time: new Date().toISOString(),
    });
  }
});

// ==========================================
// AUTHENTICATION
// ==========================================

app.use("/api/auth", auth);

// ==========================================
// PRODUCTS
// ==========================================

app.use("/api/products", products);

// ==========================================
// CATEGORIES
// ==========================================

app.use("/api/categories", categories);

// ==========================================
// CART
// ==========================================

app.use("/api/cart", cart);

// ==========================================
// WISHLIST
// ==========================================

app.use("/api/wishlist", wishlist);

// ==========================================
// ORDERS
// ==========================================

app.use("/api/orders", orders);

// ==========================================
// PAYMENTS
// ==========================================

app.use("/api/payments", payments);

// ==========================================
// USERS
// ==========================================

app.use("/api/users", users);

// ==========================================
// ADMIN DASHBOARD
// ==========================================

app.use("/api/admin/dashboard", dashboard);

// ==========================================
// ADMIN ROUTES
// ==========================================

app.use("/api/admin", adminMisc);

// ==========================================
// NOT FOUND HANDLER
// ==========================================

app.use(notFound);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorHandler);

// ==========================================
// EXPORT APP
// ==========================================

export default app;
