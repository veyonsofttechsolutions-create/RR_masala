import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function profile(req, res, next) {
  try {
    const { name, mobile, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name;
    user.mobile = mobile;
    
    // Ippo avatar-la correct-ana URL direct-a frontend-la irunthu varum
    if (avatar) {
      user.avatar = avatar; 
    }

    await user.save();
    res.json({ success: true, data: { user } });
  } catch (e) {
    next(e);
  }
}

export async function password(req, res, next) {
  try {
    const u = await User.findById(req.user._id).select("+password");
    if (!(await bcrypt.compare(req.body.currentPassword, u.password)))
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    u.password = await bcrypt.hash(req.body.newPassword, 12);
    await u.save();
    res.json({ success: true, message: "Password updated" });
  } catch (e) {
    next(e);
  }
}

export async function addresses(req, res, next) {
  try {
    const u = await User.findById(req.user._id);
    u.addresses = req.body.addresses || [];
    await u.save();
    res.json({ success: true, data: { addresses: u.addresses } });
  } catch (e) {
    next(e);
  }
}

export async function adminList(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: { items: users } });
  } catch (e) {
    next(e);
  }
}

export async function toggle(req, res, next) {
  try {
    const u = await User.findById(req.params.id);
    u.isActive = !u.isActive;
    await u.save();
    res.json({ success: true, data: { user: u } });
  } catch (e) {
    next(e);
  }
}