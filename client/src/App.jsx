import { Routes, Route, Link, Outlet } from "react-router-dom";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";

function Home() {
  return (
    <div>
      <h1>I'm the PARENT</h1>
      <Link to="/parent/child">Go to Child Page</Link>
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
        
      </nav>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />}>
          <Route path="child" element={<Child />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
