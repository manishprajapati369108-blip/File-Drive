import { Routes, Route} from "react-router-dom";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import Logout from "./pages/logout.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import HomeFile from "./pages/HomeFile.jsx";
import SavedFile from "./components/SavedFile.jsx";

const App = () => {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<HomeFile />} />
        <Route path="/saved-file" element={<SavedFile />} />
      </Routes>
    </>
  );
};

export default App;
