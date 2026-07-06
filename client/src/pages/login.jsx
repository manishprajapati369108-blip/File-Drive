import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const userData = {
    email: loginEmail,
    password: loginPassword,
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("/api/auth/login", userData, {
        withCredentials: true,
      });

      setMessage(response?.data?.message);

      setTimeout( () => {
        navigate("/home");
      }, 3000);

    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Invalid credentials")
    }
  };
  return (
    <>
      <div>
        <h1>Login</h1>
        <input
          type="email"
          value={loginEmail}
          placeholder="Email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          type="password"
          value={loginPassword}
          placeholder="Password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Register</button>{" "}
        {message && <p>{message}</p>}

        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/register">Register</Link>
      </div> 
    </>
  );
};

export default Login;
