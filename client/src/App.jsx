import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import Logout from "./pages/logout.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import HomeFile from "./pages/HomeFile.jsx";
import SavedFile from "./components/SavedFile.jsx";

const App = () => {
  return (
    <>
      <nav>
        <Link to="/">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/logout">Logout</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<HomeFile />}>
          <Route path="SavedFile" element={<SavedFile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
