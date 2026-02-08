import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ClassCard from "../components/ClassCard";
import CreateClassModal from "../components/CreateClassModal";
import "../styles/dashboard.css";

function TeacherDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);

  const navigate = useNavigate();

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/");
  };

  const handleCreateClass = (newClass) => {
    setClasses((prev) => [...prev, newClass]);
    setShowModal(false);
  };

  return (
    <DashboardLayout title="Classes">
      {/* Top bar */}
      <div className="dashboard-topbar">
        <h2>Your Classes</h2>

        <div className="topbar-actions">
          <button
            className="primary-btn"
            onClick={() => setShowModal(true)}
          >
            + Create Class
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Classes */}
      {classes.length === 0 ? (
        <div className="empty-state">
          <p>No classes created yet</p>
          <span>Create a class to get started</span>
        </div>
      ) : (
        <div className="dashboard-grid">
          {classes.map((cls, index) => (
            <ClassCard
              key={index}
              title={cls.title}
              teacher="You"
              code={cls.code}
            />
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <CreateClassModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateClass}
        />
      )}
    </DashboardLayout>
  );
}

export default TeacherDashboard;
