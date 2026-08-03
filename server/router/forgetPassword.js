// router/forgotPassword.js
import sendEmail from "../services/emailService.js";
import generateRandom from "crypto-randomizer";
import User from "../models/user.js";
import express from "express";

const router = express.Router();

router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Received forgot-password request");
    console.log("📧 Email:", email);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(200).json({ message: "If email exists, OTP sent" });
    }

    // ✅ Generate 6-digit OTP
    const otp = generateRandom(6, "number");
    console.log("🔢 Generated OTP:", otp);

    // ✅ Save OTP with 15-minute expiry
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    console.log("💾 OTP saved to database");

    // ✅ Create HTML content
    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { max-width: 500px; margin: 0 auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .otp { font-size: 36px; font-weight: bold; color: #2563eb; padding: 15px 25px; background: #f0f4ff; border-radius: 8px; display: inline-block; letter-spacing: 5px; }
                    .warning { color: #dc2626; font-size: 14px; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🔐 Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password for your File Drive account.</p>
                    <p>Use the OTP below to complete the process:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span class="otp">${otp}</span>
                    </div>
                    <p class="warning">⏳ This OTP expires in <strong>15 minutes</strong>.</p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                    <div class="footer">
                        <p>File Drive - Secure File Storage</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    // ✅ Send email using BrevoClient
    console.log("📧 Attempting to send email...");
    await sendEmail(email, "🔐 Password Reset OTP", htmlContent);
    console.log("📧 Email sent successfully ✅");

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Error in forgot-password:", error.message);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
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
    const token = generateRandom(32, "alphaNumeric");
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

    // ✅ Generate new OTP
    const otp = generateRandom(6, "number");
    console.log("🔢 New OTP generated:", otp);

    // ✅ Save new OTP with 15-minute expiry
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    console.log("💾 New OTP saved to database");

    // ✅ Create HTML content for resend
    const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { max-width: 500px; margin: 0 auto; padding: 30px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .otp { font-size: 36px; font-weight: bold; color: #2563eb; padding: 15px 25px; background: #f0f4ff; border-radius: 8px; display: inline-block; letter-spacing: 5px; }
                    .warning { color: #dc2626; font-size: 14px; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                    .highlight { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🔄 New OTP Generated</h2>
                    <p>Hello,</p>
                    <p>You requested a new OTP for password reset.</p>
                    <div class="highlight">
                        <p><strong>Note:</strong> Your previous OTP is no longer valid.</p>
                    </div>
                    <p>Use the new OTP below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span class="otp">${otp}</span>
                    </div>
                    <p class="warning">⏳ This OTP expires in <strong>15 minutes</strong>.</p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                    <div class="footer">
                        <p>File Drive - Secure File Storage</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    // ✅ Send email using Brevo API (NOT transporter)
    console.log("📧 Attempting to send new OTP...");
    await sendEmail(email, "🔄 New Password Reset OTP", htmlContent);
    console.log("📧 New OTP sent successfully ✅");

    res.json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error in resend-otp:", error.message);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

export default router;
