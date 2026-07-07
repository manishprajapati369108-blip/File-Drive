// router/forgotPassword.js
console.log("✅ Forgot password router is LOADING...");
import transporter from "../services/emailService.js";
import generateRandom from "crypto-randomizer";
import express from "express";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// ===== 1. FORGOT PASSWORD - Send OTP =====
router.post("/forget-password", async (req, res) => {
  try {
    console.log("📩 Received forgot-password request");
    const { email } = req.body;
    console.log("📧 Email:", email);

    // Validate email
    if (!email) {
      console.log("❌ No email provided");
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(200).json({ message: "If email exists, OTP sent" });
    }

    // Generate 6-digit OTP
    const otp = generateRandom(6, "number");
    console.log("🔢 Generated OTP:", otp);

    // Save OTP with 15 min expiry
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    console.log("💾 OTP saved to database");

    // Send email via Brevo
    console.log("📧 Attempting to send email...");
    await transporter.sendMail({
      from: `"App" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This expires in 15 minutes.</p>
      `,
    });
    console.log("📧 Email sent successfully");

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    // ✅ Detailed error logging
    console.error("❌ ERROR in forgot-password:");
    console.error("📧 Error message:", error.message);
    console.error("📧 Error stack:", error.stack);
    console.error("📧 Full error:", error);

    // Send detailed error to frontend
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
      stack: error.stack, // Remove this in production!
    });
  }
});

// ===== 2. VERIFY OTP =====
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("📩 Received verify-otp request");
    const { email, otp } = req.body;
    console.log("📧 Email:", email, "🔢 OTP:", otp);

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log("❌ Invalid or expired OTP");
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Generate temporary token
    const token = generateRandom(32, "alphanumeric");
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    console.log("✅ OTP verified, token generated");

    res.json({ tempToken: token });
  } catch (error) {
    console.error("❌ ERROR in verify-otp:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// ===== 3. RESET PASSWORD =====
router.post("/reset-password", async (req, res) => {
  try {
    console.log("📩 Received reset-password request");
    const { tempToken, newPassword } = req.body;

    if (!tempToken || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({
      resetToken: tempToken,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log("❌ Invalid or expired session");
      return res.status(400).json({ error: "Invalid or expired session" });
    }

    user.password = newPassword;
    user.resetOTP = null;
    user.resetOTPExpires = null;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
    console.log("✅ Password reset successful");

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("❌ ERROR in reset-password:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// ===== 4. RESEND OTP =====
router.post("/resend-otp", async (req, res) => {
  try {
    console.log("📩 Received resend-otp request");
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If email exists, OTP sent" });
    }

    const otp = generateRandom(6, "number");
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: `"App" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your New Password Reset OTP",
      html: `
        <h2>New OTP Generated</h2>
        <p>Your previous OTP is no longer valid.</p>
        <p>Your new OTP is: <strong>${otp}</strong></p>
        <p>This expires in 15 minutes.</p>
      `,
    });
    console.log("📧 New OTP sent");

    res.json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("❌ ERROR in resend-otp:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

export default router;
