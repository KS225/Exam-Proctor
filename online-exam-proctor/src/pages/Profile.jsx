import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  /* ============================
     FETCH PROFILE
  ============================ */
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

        const data = await res.json();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ============================
     IMAGE UPLOAD
  ============================ */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("profilePic", file);

    try {
      setUploading(true);
      const res = await fetch(
        "http://localhost:5000/api/profile/upload-photo",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await res.json();
      setProfile((prev) => ({ ...prev, profilePic: data.profilePic }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ============================
     INPUT CHANGE
  ============================ */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  const token = localStorage.getItem("token");

  // 👇 REMOVE large fields before sending
  const { profilePic, role, ...safeData } = formData;

  try {
    const res = await fetch(
      "http://localhost:5000/api/profile/update",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(safeData),
      }
    );

    const data = await res.json();
    setProfile(data);
    setEditing(false);
  } catch (err) {
    alert("Failed to update profile");
  }
};


  /* ============================
     LOGOUT
  ============================ */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <p className="loading-text">Loading profile...</p>;

  return (
    <DashboardLayout title="Profile">
      <div className="profile-card">
        {/* PROFILE IMAGE */}
        <div className="profile-pic-wrapper">
          <img
            src={profile.profilePic}
            alt="Profile"
            className="profile-picture"
          />

          <label className="upload-btn">
            {uploading ? "Uploading..." : "Change Photo"}
            <input type="file" hidden onChange={handleImageUpload} />
          </label>
        </div>

        {/* NAME */}
        {editing ? (
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="edit-input"
          />
        ) : (
          <h2>{profile.name}</h2>
        )}

        <p className="role">{profile.role.toUpperCase()}</p>

        {/* INFO */}
        <div className="profile-info">
          <div>
            <strong>Email:</strong>{" "}
            {editing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              profile.email
            )}
          </div>

          {profile.role === "student" && (
            <>
              <div>
                <strong>Roll No:</strong>{" "}
                {editing ? (
                  <input
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  profile.rollNo
                )}
              </div>

              <div>
                <strong>Department:</strong>{" "}
                {editing ? (
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  profile.department
                )}
              </div>
            </>
          )}

          {profile.role === "teacher" && (
            <>
              <div>
                <strong>Employee ID:</strong>{" "}
                {editing ? (
                  <input
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  profile.employeeId
                )}
              </div>

              <div>
                <strong>Subject:</strong>{" "}
                {editing ? (
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  profile.subject
                )}
              </div>
            </>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">
          {editing ? (
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="edit-btn">
              Edit Profile
            </button>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
