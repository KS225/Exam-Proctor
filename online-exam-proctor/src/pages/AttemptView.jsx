import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/attempt.css";

function AttemptView() {

  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [marks, setMarks] = useState({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    fetchAttempt();
  }, [attemptId]);

  const fetchAttempt = async () => {
    const res = await fetch(
      `http://localhost:5000/api/exams/attempt/${attemptId}`
    );

    if (!res.ok) {
      console.error("Failed to fetch attempt");
      return;
    }

    const data = await res.json();
    setAttempt(data);
  };

  const exam = attempt?.examId;

  const isDescriptive = exam?.type === "descriptive";

  // ✅ Total allowed marks
  const totalAllowedMarks = exam
    ? exam.questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)
    : 0;

  // ✅ Current total entered
  const totalGivenMarks = Object.values(marks).reduce(
    (sum, m) => sum + Number(m || 0),
    0
  );

const handleMarksChange = (qIndex, value) => {

  const maxMarks = Number(exam.questions[qIndex]?.marks || 0);

  if (value > maxMarks) {
    alert(`Max allowed is ${maxMarks}`);
    return;
  }

  if (value < 0) {
    alert("Marks cannot be negative");
    return;
  }

  const updatedMarks = {
    ...marks,
    [qIndex]: value
  };

  const total = Object.values(updatedMarks).reduce(
    (sum, m) => sum + Number(m || 0),
    0
  );

  if (total > totalAllowedMarks) {
    alert(`Total marks cannot exceed ${totalAllowedMarks}`);
    return;
  }

  setMarks(updatedMarks);
};

  const saveMarks = async () => {

    if (!isDescriptive) {
      alert("Manual grading is only allowed for descriptive exams");
      return;
    }

    if (Object.keys(marks).length === 0) {
      alert("Please enter marks before saving");
      return;
    }

    if (totalGivenMarks > totalAllowedMarks) {
      alert(`Total marks cannot exceed ${totalAllowedMarks}`);
      return;
    }

    setLoading(true);
    setError("");

    try {

      const token = localStorage.getItem("token");
      console.log("TOKEN:", token); // 🔍 DEBUG

      const res = await fetch(
        "http://localhost:5000/api/exams/grade",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            attemptId,
            marks,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        // ✅ Password required flow
       if (res.status === 403 && data?.message?.includes("Password")) {
          setShowPassword(true);
          setLoading(false);
          return;
        }

        setError(data.message || "Something went wrong");
        setShake(true);

        setTimeout(() => setShake(false), 500);
        setLoading(false);
        return;
      }

      alert("Marks saved successfully ✅");

      setShowPassword(false);
      setPassword("");
      setMarks({});
      setLoading(false);

      // 🔄 Refresh updated data
      fetchAttempt();

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (!attempt) return <p>Loading...</p>;

  return (

    <div className="attempt-container">

      <div className="attempt-header">
        <h2>{exam.title}</h2>

        <div className="student-info">
          <p><b>Student:</b> {attempt.studentId?.name}</p>
          <p><b>Violations:</b> {attempt.violations}</p>
          <p><b>Type:</b> {exam.type}</p>
        </div>
      </div>

      <hr />

      {/* ✅ TOTAL DISPLAY */}
      {isDescriptive && (
        <div className="total-marks">
          <b>Total:</b> {totalGivenMarks} / {totalAllowedMarks}
        </div>
      )}

      <div className="questions-section">

        {exam.questions.map((q, index) => (

          <div key={index} className="question-card">

            <div className="question-title">
              {index + 1}. {q.question}
              <span className="marks">
                ({q.marks} marks)
              </span>
            </div>

            <div className="student-answer">
              {attempt.answers[index] || "No answer"}
            </div>

            {/* ✅ Only show grading for descriptive */}
            {isDescriptive && (
              <div className="grading">
                <label>Marks Given</label>

                <input
                  type="number"
                  min="0"
                  max={q.marks}
                  value={marks[index] || ""}
                  onChange={(e) => {
  const value = Number(e.target.value);

  if (value > q.marks) {
    alert(`Max allowed for this question is ${q.marks}`);
    return;
  }

  if (value < 0) {
    alert("Marks cannot be negative");
    return;
  }

  handleMarksChange(index, value);
}}
                />
              </div>
            )}

          </div>

        ))}

      </div>

      {/* ✅ Save only for descriptive */}
      {isDescriptive && (
        <button className="save-btn" onClick={saveMarks}>
          {loading ? "Saving..." : "Save Marks"}
        </button>
      )}
      
      <button
        className="backbtn"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {/* PASSWORD MODAL */}
      {showPassword && (

        <div className="password-modal">

          <div className={`password-box ${shake ? "shake" : ""}`}>

            <h3>Confirm Teacher Password</h3>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="error-text">{error}</p>
            )}

            <div className="password-actions">

              <button
                className="confirm-btn"
                onClick={saveMarks}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Confirm"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowPassword(false);
                  setPassword("");
                  setError("");
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );

}

export default AttemptView;