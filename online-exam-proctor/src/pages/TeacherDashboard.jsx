import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ClassCard from "../components/ClassCard";
import CreateClassModal from "../components/CreateClassModal";
import "../styles/dashboard.css";

function TeacherDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* =========================
     CREATE CLASS
     ========================= */
  const handleCreateClass = async (newClass) => {
    const res = await fetch("http://localhost:5000/api/teacher/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newClass),
    });

    const data = await res.json();

    if (res.ok) {
      setClasses((prev) => [...prev, data]);
      setShowModal(false);
    } else {
      alert(data.message);
    }
  };

  /* =========================
     DELETE CLASS
     ========================= */
  const handleDeleteClass = async (classId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) return;

    const res = await fetch(
      `http://localhost:5000/api/teacher/classes/${classId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.ok) {
      setClasses((prev) => prev.filter((cls) => cls._id !== classId));
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  /* =========================
     LOAD CLASSES
     ========================= */
  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch("http://localhost:5000/api/teacher/classes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setClasses(data.classes || []);
    };

    fetchClasses();
  }, []);

  return (
    <DashboardLayout title="Teacher Dashboard">
      {/* TOP BAR */}
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

      {/* CONTENT */}
      {classes.length === 0 ? (
        <div className="empty-state">
          <h3>No classes yet</h3>
          <p>Click “Create Class” to get started</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {classes.map((cls) => (
            <ClassCard
  key={cls._id}
  title={cls.title}
  subject={cls.subject}   // ✅ NOW WORKS
  code={cls.code}
  studentsCount={cls.students?.length || 0}
  onDelete={() => handleDeleteClass(cls._id)}
/>
))}
        </div>
      )}

      {/* MODAL */}
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