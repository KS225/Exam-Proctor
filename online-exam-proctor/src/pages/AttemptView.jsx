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

    const updatedMarks = {
      ...marks,
      [qIndex]: value
    };

    const total = Object.values(updatedMarks).reduce(
      (sum, m) => sum + Number(m || 0),
      0
    );

    // ❌ Prevent exceeding total
    if (total > totalAllowedMarks) {
      alert(`Total marks cannot exceed ${totalAllowedMarks}`);
      return;
    }

    setMarks(updatedMarks);
  };

  const saveMarks = async () => {

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

        // ✅ Password flow (NOT error)
        if (data?.message?.includes("Password required")) {
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

      alert("Marks saved successfully");

      setShowPassword(false);
      setPassword("");
      setLoading(false);

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
        </div>
      </div>

      <hr />

      {/* ✅ TOTAL DISPLAY */}
      <div className="total-marks">
        <b>Total:</b> {totalGivenMarks} / {totalAllowedMarks}
      </div>

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

            <div className="grading">
              <label>Marks Given</label>

              <input
                type="number"
                min="0"
                max={q.marks}
                onChange={(e) =>
                  handleMarksChange(index, Number(e.target.value))
                }
              />
            </div>

          </div>

        ))}

      </div>

      <button className="save-btn" onClick={saveMarks}>
        Save Marks
      </button>

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