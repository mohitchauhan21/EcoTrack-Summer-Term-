import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const getRoleRank = (r: string) => {
  switch (r) {
    case 'admin': return 1;
    case 'executive': return 2;
    case 'employee': return 3;
    default: return 99;
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const users = await User.find({ companyId }).populate("departmentId");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, companyId, departmentId } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email, and role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const reqRole = req.user!.role;
    if (getRoleRank(reqRole) >= getRoleRank(role)) {
      return res.status(403).json({ message: "Insufficient permissions to create user with this role." });
    }

    // Generate a random temporary password for new users
    const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-2).toUpperCase() + "1!";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      companyId,
      departmentId: departmentId || undefined
    });

    await newUser.save();
    
    // Return user without exposing the temp password hash
    const userObj = newUser.toObject();
    const { password, ...userWithoutPassword } = userObj;
    
    res.status(201).json({ 
      ...userWithoutPassword,
      tempPassword // Send back so admin can share it with the new user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reqRole = req.user!.role;

    const targetUser = await User.findOne({ _id: id, companyId: req.user!.companyId });
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (getRoleRank(reqRole) >= getRoleRank(targetUser.role)) {
      return res.status(403).json({ message: "Insufficient permissions to delete this user." });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
