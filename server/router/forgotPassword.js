import transporter from "../services/emailService";
import generateRandom from "crypto-randomizer";
import express from "express";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.router;

router.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "if email exists, OTP sent" });
    }

    const otp = generateRandom(6, "number");

    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    await transporter.sendMail({
      from: `"App" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
              <h2>Password Reset<h2>
              <p>Your OTP is: <strong>${otp}</strong></p>
              <p> This expires in 15 minutes. </p>
             `,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/api/verify-otp", async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: tempToken,
      resetTokenExpires: { $gt: newDate() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired session" });
    }

    //update password (will be hashed automatically)

    user.password = newPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;