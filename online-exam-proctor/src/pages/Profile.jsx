import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <p className="loading-text">Loading profile...</p>;

  return (
    <DashboardLayout title="Profile">
      <div className="profile-card">
        <h2>{profile.name}</h2>
        <p className="role">{profile.role.toUpperCase()}</p>

        <div className="profile-info">
          <div><strong>Email:</strong> {profile.email}</div>

          {profile.role === "student" && (
            <>
              <div><strong>Roll No:</strong> {profile.rollNo}</div>
              <div><strong>Department:</strong> {profile.department}</div>
            </>
          )}

          {profile.role === "teacher" && (
            <>
              <div><strong>Employee ID:</strong> {profile.employeeId}</div>
              <div><strong>Subject:</strong> {profile.subject}</div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
