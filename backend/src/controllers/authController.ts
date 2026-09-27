import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || "oanh_native_jwt_super_secret_key_2026_secure";
};

const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ id: userId, email }, getJwtSecret(), {
    expiresIn: "7d",
  });
};

const sanitizeUser = (user: IUser) => {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const register = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password, name } = req.body;

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ error: "Email is required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedEmail = email.trim().toLowerCase();
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  const displayName = typeof name === "string" && name.trim() ? name.trim() : normalizedEmail.split("@")[0];

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: displayName,
      avatar: "",
    });

    const token = generateToken(newUser._id.toString(), newUser.email);

    return res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
};

export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken(user._id.toString(), user.email);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error during login." });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated." });
  }

  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
};
