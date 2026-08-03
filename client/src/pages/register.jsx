import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();

  const userData = {
    email: email,
    password: password,
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  console.log('📤 Sending to:', `${api}/auth/register`); // ← What URL?
  console.log('📦 Data:', userData); // ← What data?

    try {
      const response = await axios.post(
       ` ${api}/auth/register`,
        userData,
        { withCredentials: true }
      );

      console.log(response.data);

      setMessage(response?.data?.message);

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.log(error.response.data.error);
      setMessage(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Register
        </h1>

        <input
          type="email"
          value={email}
          placeholder="Email"
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 active:scale-95"
        >
          Register
        </button>

        {message && (
          <p className="text-center text-green-600 font-medium">
            {message}
          </p>
        )}

        <Link
          to="/login"
          className="text-center text-blue-600 hover:underline"
        >
          Already have an account? Login
        </Link>

      </div>
    </div>
  );
};

export default Register;