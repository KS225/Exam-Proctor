import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/studentsignin.css";

const StudentSignin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: "student", // 🔥 IMPORTANT
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "student");

      // ✅ Redirect
      navigate("/studentdashboard");
    } catch (error) {
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-header">
          <h1>AI Exam Proctor</h1>
          <p>Student Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="student@school.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
<br></br>
        <p className="signup-text">
          New? <Link to="/signup">Register here</Link>
        </p>
        <br></br>
        <p className="signup-text">
          Looking for Teacher's Login? <Link to="/teachersignin">Login here</Link>
        </p>

        <div className="signin-footer">
          © 2026 AI Proctored Examination System
        </div>
      </div>
    </div>
  );
};

export default StudentSignin;
