import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const navigate = useNavigate();

  const userData = {
    email: loginEmail,
    password: loginPassword,
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${api}/auth/login`, userData, {
        withCredentials: true,
      });
      
      console.log(response.data)
      if (response.data.success) {
        console.log(response.data.message);
      }

      setMessage(response?.data?.message);

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            Login
          </h1>

          <input
            type="email"
            value={loginEmail}
            placeholder="Email"
            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <input
            type="password"
            value={loginPassword}
            placeholder="Password"
            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 active:scale-95"
          >
            Login
          </button>

          {message && (
            <p className="text-center text-green-600 font-medium">
              {message}
            </p>
          )}

          <div className="flex justify-between text-sm">
            <Link
              to="/forget-password"
              className="text-blue-600 hover:underline"
            >
              Forget Password
            </Link>

            <Link
              to="/"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;