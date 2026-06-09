import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("")
  const navigate = useNavigate();

  const userData = {
    email: email,
    password: password,
  }
  const handleRegister = async(e) => {
    e.preventDefault();
     try {
      const response =  await axios.post('/api/auth/register', userData , { withCredentials: true });
       console.log(response.data);

       setMessage( response?.data?.message)

       setTimeout(() => {
        navigate("/login")
       }, 3000)
      

     } catch (error) {
      console.log(error.response.data.error)
      setMessage(error.response?.data?.error || "Registration failed")
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

      {message && <p>{message}</p>}
      <Link to="/login">Login</Link> {" "}
      <Link to="/home">Home</Link>
    </div>


);
};

export default Register;
