import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

const makeToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email and password required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, city });
    res.status(201).json({
      token: makeToken(user),
      user: { id: user._id, name: user.name, email: user.email, city: user.city },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password)))
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      token: makeToken(user),
      user: { id: user._id, name: user.name, email: user.email, city: user.city },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;