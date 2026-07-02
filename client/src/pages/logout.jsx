import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Logout = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true },
      );
      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Something Went Wrong!!");
    }
  };
  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Logout
