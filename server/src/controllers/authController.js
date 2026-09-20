import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
const cookieOpts = {
  httpOnly: true,
  secure: env.secureCookie,
  sameSite: env.secureCookie ? "none" : "lax",
  maxAge: 7 * 24 * 3600 * 1000,
};
function token(u) {
  return jwt.sign({ id: u._id.toString(), role: u.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}
export async function register(req, res, next) {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile || !password)
      return res
        .status(422)
        .json({ success: false, message: "All required fields are needed" });
    if (await User.exists({ $or: [{ email }, { mobile }] }))
      return res
        .status(409)
        .json({
          success: false,
          message: "Email or mobile already registered",
        });
    const hash = await bcrypt.hash(password, 12);
    const u = await User.create({ name, email, mobile, password: hash });
    res.cookie("token", token(u), cookieOpts);
    res
      .status(201)
      .json({
        success: true,
        data: {
          user: {
            id: u._id,
            name: u.name,
            email: u.email,
            mobile: u.mobile,
            role: u.role,
          },
        },
      });
  } catch (e) {
    next(e);
  }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email }).select("+password");
    if (!u || !(await bcrypt.compare(password, u.password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    res.cookie("token", token(u), cookieOpts);
    res.json({
      success: true,
      data: {
        user: {
          id: u._id,
          name: u.name,
          email: u.email,
          mobile: u.mobile,
          role: u.role,
        },
      },
    });
  } catch (e) {
    next(e);
  }
}
export function logout(req, res) {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
}
export function me(req, res) {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile,
        role: req.user.role,
        addresses: req.user.addresses,
      },
    },
  });
}
