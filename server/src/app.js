import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import { env } from "./config/env.js";

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
      // Allow requests without an Origin header.
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

app.get("/api/health", (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    success: connected,
    api: "online",
    database: states[mongoose.connection.readyState] || "unknown",
    readyState: mongoose.connection.readyState,
    time: new Date().toISOString(),
  });
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

export default app;
