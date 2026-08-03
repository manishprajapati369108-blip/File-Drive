// pages/ForgotPassword.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const ForgetPassword = () => {
  // States
  const [step, setStep] = useState("email"); // email | otp | password | success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [tempToken, setTempToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef([]);
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ===== SEND OTP =====
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${api}/otp/forget-password`, { email });
      setMessage(res.data.message);
      setStep("otp");
      startTimer();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      console.log(err);
    }
    setLoading(false);
  };

  // ===== VERIFY OTP =====
  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${api}/otp/verify-otp`, {
        email,
        otp: otpValue,
      });
      setTempToken(res.data.tempToken);
      setMessage("OTP verified!");
      setStep("password");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      console.log(err);
    }
    setLoading(false);
  };

  // ===== RESET PASSWORD =====
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be 8+ characters");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(`${api}/otp/reset-password`, {
        tempToken,
        newPassword,
      });
      setMessage("Password reset successful!");
      setStep("success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      console.log(err);
    }
    setLoading(false);
  };

  // ===== OTP INPUT HANDLERS =====
  const handleOTPChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      handleVerifyOTP();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ===== RESEND TIMER =====
  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      await axios.post(`${api}/otp/resend-otp`, { email });
      setMessage("New OTP sent successfully!");
      startTimer();
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend OTP");
    }
    setLoading(false);
  };

  // Auto focus
  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  // ===== RENDER =====
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-black">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {step === "email" && "Reset Password"}
          {step === "otp" && "Enter OTP"}
          {step === "password" && "New Password"}
          {step === "success" && "Success!"}
        </h2>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Enter 6-digit code sent to{" "}
              <span className="font-medium">{email}</span>
            </p>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold border-b-4 border-gray-300 focus:border-indigo-500 outline-none transition bg-transparent"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.some((d) => d === "")}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={handleResend}
              disabled={timer > 0 || loading}
              className="w-full text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 transition text-sm py-2"
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
            </button>
            <button
              onClick={() => setStep("email")}
              className="w-full text-gray-500 hover:text-gray-700 transition text-sm py-2"
            >
              ← Change email
            </button>
          </div>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New password (min 8 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              required
              minLength="8"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={
                loading ||
                newPassword.length < 8 ||
                newPassword !== confirmPassword
              }
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && (
          <div className="text-center py-6">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg font-medium text-gray-800">
              Password reset successful!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
