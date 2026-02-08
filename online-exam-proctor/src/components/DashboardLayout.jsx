import "../styles/dashboard.css";
import { Link, useNavigate } from "react-router-dom";

const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // student or teacher

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/"); // redirect to home/login
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">AI Proctor</div>

        <nav className="dashboard-nav">
          {/* Classes link changes based on role */}
          <Link to={role === "student" ? "/studentdashboard" : "/teacherdashboard"}>
            Classes
          </Link>
          <Link to="/exams">Exams</Link>
          <Link to="/profile">Profile</Link>
        </nav>

       
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{title}</h1>
        </header>

        <section className="dashboard-content">{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;
