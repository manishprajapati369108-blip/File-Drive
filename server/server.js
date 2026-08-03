import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./router/authRoutes.js";
import forgetPassword from "./router/forgetPassword.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import fileStorage from "./router/fileStorage.js";

dotenv.config({ path: "../.env" });

const app = express();
app.use(
  cors({
    origin: "https://file-drive-ten.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use("/auth", authRoutes);
app.use("/otp", forgetPassword);
app.use("/file", fileStorage);

app.get("/", (req, res) => {
  res.json({
    message: "File Drive API is running!",
    status: "✅ Online",
    endpoints: {
      auth: "/auth",
      files: "/file",
      otp: "/otp",
    },
  });
});

// server/server.js (add this before app.listen)

// ✅ Test email route
app.get('/test-email', async (req, res) => {
  try {
    console.log('🧪 Testing email service...');
    
    // Check environment variables
    const config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD ? '✅ Set' : '❌ Missing',
      from: process.env.EMAIL_FROM,
    };
    console.log('📧 Email config:', config);
    
    // Try to send a test email
    const testResult = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM, // Send to yourself
      subject: "Test Email",
      html: "<h1>Test Email from Render</h1>",
    });
    
    console.log('✅ Email sent:', testResult.messageId);
    res.json({ 
      message: 'Email service is working!',
      messageId: testResult.messageId 
    });
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    res.status(500).json({ 
      error: 'Email service failed',
      details: error.message,
      code: error.code,
      command: error.command
    });
  }
});

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server listening on ${port}`);
    });
  } catch (error) {
    console.log("something went wrong");
    console.log(error.message);
  }
};

start();
