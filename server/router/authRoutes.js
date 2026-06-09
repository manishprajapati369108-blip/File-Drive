import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";
import User from "../models/user.js";
const router = express.Router();

await connectDB();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(!email || !password) {
        return(
            res.status(400).json({
                error: "Email and password are required"
            })
        )
    }

    if (existingUser) {
      return res.status(400).json({
        error: "Email already Exist",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email: email,
      password: hashedPassword,
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

router.post("/login", (req, res) => {});

router.post("/logout", (req, res) => {});

export default router;
