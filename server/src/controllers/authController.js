import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { env } from "../config/env.js";

// ==========================================
// COOKIE CONFIGURATION
// ==========================================

const cookieOpts = {
  httpOnly: true,
  secure: env.secureCookie,
  sameSite: env.secureCookie ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ==========================================
// GENERATE JWT TOKEN
// ==========================================

function token(user) {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is missing from the environment");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
}

// ==========================================
// USER RESPONSE
// ==========================================

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
  };
}

// ==========================================
// REGISTER
// ==========================================

export async function register(req, res, next) {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(422).json({
        success: false,
        message: "All required fields are needed",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobile = mobile.trim();

    const existingUser = await User.exists({
      $or: [
        { email: normalizedEmail },
        { mobile: normalizedMobile },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or mobile already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
    });

    const jwtToken = token(user);

    res.cookie("token", jwtToken, cookieOpts);

    return res.status(201).json({
      success: true,
      data: {
        user: userResponse(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// LOGIN
// ==========================================

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    const jwtToken = token(user);

    res.cookie("token", jwtToken, cookieOpts);

    return res.status(200).json({
      success: true,
      data: {
        user: userResponse(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// LOGOUT
// ==========================================

export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.secureCookie,
    sameSite: env.secureCookie ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

// ==========================================
// CURRENT AUTHENTICATED USER
// ==========================================

export function me(req, res) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        ...userResponse(req.user),
        addresses: req.user.addresses,
      },
    },
  });
}
