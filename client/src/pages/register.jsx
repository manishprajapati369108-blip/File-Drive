import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userData = {
    email: email,
    password: password,
  }



  const handleRegister = async() => {
     try {
      const response =  await axios.post('/api/auth/register', userData , { withCredentials: true });
       console.log(response.data);
     } catch (error) {
      console.log(error.response.data.error)
     }
  }
  return (
    <div>
      <h1>Register</h1>

      <input 
      type="email"
      value={email}
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)} />

      <input
      type="password"
      value={password}
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
       />

       <button onClick={handleRegister} >Register</button> {" "}

      
      <Link to="/login">Login</Link> {" "}
      <Link to="/home">Home</Link>
    </div>
  );
};

export default Register;
