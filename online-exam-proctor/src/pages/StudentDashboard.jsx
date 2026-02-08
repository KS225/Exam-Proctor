import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ClassCard from "../components/ClassCard";
import JoinClassModal from "../components/JoinClassModal";
import "../styles/dashboard.css";

function StudentDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔒 Auth Guard (redirect if not logged in)
useEffect(() => {
  if (!localStorage.getItem("token")) {
    navigate("/", { replace: true });
  }
}, [navigate]);


  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/");
  };

  // 🔐 Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/student/classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch classes");

        const data = await res.json();
        setClasses(data.classes || []);
      } catch (error) {
        console.error("Dashboard error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleJoinClass = (newClass) => {
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
            + Join Class
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="loading-text">Loading classes...</p>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <p>No classes joined yet</p>
          <span>Use a class code to join your class</span>
        </div>
      ) : (
        <div className="dashboard-grid">
          {classes.map((cls) => (
            <ClassCard
              key={cls._id}
              title={cls.title}
              teacher={cls.teacherName}
              code={cls.code}
            />
          ))}
        </div>
      )}

      {showModal && (
        <JoinClassModal
          onClose={() => setShowModal(false)}
          onJoin={handleJoinClass}
        />
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;
