import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    department: "",
    employeeId: "",
    subject: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload =
      role === "student"
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            rollNo: formData.rollNo,
            department: formData.department,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            employeeId: formData.employeeId,
            subject: formData.subject,
          };

    const url =
      role === "student"
        ? "http://localhost:5000/api/auth/register/student"
        : "http://localhost:5000/api/auth/register/teacher";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert(data.message);
    navigate("/studentsignin");
  } catch (error) {
    console.error("FETCH ERROR:", error);
    alert("Backend not reachable. Is server running?");
  }
};



  return (
  <div className="register-container">
    <form className="register-card" onSubmit={handleSubmit}>

      {/* ROLE TOGGLE */}
      <div className="role-toggle">
        <button
          type="button"
          className={role === "student" ? "active" : ""}
          onClick={() => setRole("student")}
        >
          Student
        </button>
        <button
          type="button"
          className={role === "teacher" ? "active" : ""}
          onClick={() => setRole("teacher")}
        >
          Teacher
        </button>
      </div>

      <h2>
        {role === "student" ? "Student Registration" : "Teacher Registration"}
      </h2>
      <p className="subtitle">Create your account</p>

      {/* COMMON FIELDS */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {/* PASSWORD */}
      <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <span
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      {/* STUDENT ONLY */}
      {role === "student" && (
        <>
          <input
            type="number"
            name="rollNo"
            placeholder="Roll Number"
            value={formData.rollNo}
            onChange={handleChange}
            required
            min={0}
            onWheel={(e) => e.target.blur()}
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </>
      )}

      {/* TEACHER ONLY */}
      {role === "teacher" && (
        <>
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </>
      )}

      <button type="submit">Register</button>

      <p className="login-text">
        Already registered? <Link to="/studentsignin">Sign In</Link>
      </p>
    </form>
  </div>
);

}

export default Signup;
