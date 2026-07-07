import { Routes, Route, Link, Outlet } from "react-router-dom";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import Logout from "./pages/logout.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";

function Home() {
  return (
    <div>
      <h1>I'm the PARENT</h1>
      <Outlet /> {/* ← CHILD GOES HERE */}
      <footer>Parent Footer</footer>
    </div>
  );
}

// Child component
function Child() {
  return (
    <>
      <h2>I'm the CHILD</h2>
      <Link to="/home">Back to Parent</Link>
    </>
  );
}

const App = () => {
  return (
    <>
      <nav>
        <Link to="/">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/home/child">Go to Child Page</Link>
        <Link to="/home/logout">Logout</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        <Route path="/home" element={<Home />}>
          <Route path="child" element={<Child />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
