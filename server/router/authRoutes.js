import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

await connectDB();

// server.js - Add this before app.listen

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (existingUser) {
      return res.status(400).json({
        error: "Email already Exist",
      });
    }

    const user = new User({
      email: email,
      password: password,
    });

    await user.save();

    res.status(201).json({
      message: "registered successfull",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = await jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path:"/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login Succcessful! You are logged In",
      email: user.email,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    console.log("Something is Wrong !!!");
    res.status(500).json({
      error: "Server error",
    });
  }
});

router.post("/logout", (req, res) => {
   console.log("LOGOUT ROUTE HIT");
  console.log("Cookies:", req.cookies);
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({ 
    success: true,
    message: "LoggedOut successfully" });
});

export default router;
 