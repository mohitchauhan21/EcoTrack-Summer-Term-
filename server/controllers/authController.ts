import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Company, VALID_REGIONS } from "../models/Company.js";

const signToken = (payload: { id: string; role: string; companyId: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment variables");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// Registers a brand new company along with its first user (always "admin").
// This matches the onboarding flow: a company doesn't exist until someone signs up for it.
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, companyName, region } = req.body;

    if (!name || !email || !password || !companyName || !region) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    if (!VALID_REGIONS.includes(region)) {
      return res.status(400).json({ message: `Region must be one of: ${VALID_REGIONS.join(", ")}` });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const company = await Company.create({ name: companyName, region });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      companyId: company._id,
    });

    const token = signToken({ id: user._id.toString(), role: user.role, companyId: company._id.toString() });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      companyName: company.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password").populate("companyId", "name");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const companyId = (user.companyId as any)._id?.toString() || user.companyId.toString();
    const token = signToken({ id: user._id.toString(), role: user.role, companyId });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, departmentId: user.departmentId },
      companyName: (user.companyId as any).name || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Lets the frontend restore session details (e.g. after a hard refresh) using just the token,
// without re-sending credentials.
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).populate("companyId", "name");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, departmentId: user.departmentId },
      companyName: (user.companyId as any)?.name || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
