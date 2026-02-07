import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo">AI Exam Proctor</span>
        </div>

        <div className="navbar-right">
          <Link to="/studentsignin" className="nav-btn login-btn">
            
            Login
          </Link>

          <Link to="/signup" className="nav-btn signup-btn">
           
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
