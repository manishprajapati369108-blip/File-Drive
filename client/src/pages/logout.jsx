import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  console.log("Logout Component Loaded");

  
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    console.log("Logout button clicked");

    e.preventDefault();
    try {
      const response = await axios.post(
        `${api}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        
        console.log(response.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      console.log(error.response?.data?.error || "Something Went Wrong!!");
    }
  };
  return (
    <div>
      <button
         onClick={handleLogout}
      >
        LogOut
      </button>
    </div>
  );
};

export default Logout;
