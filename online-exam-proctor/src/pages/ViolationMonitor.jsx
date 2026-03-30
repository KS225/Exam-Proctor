import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/violation.css";

function ViolationMonitor({ classCode }) {
  const [examGroups, setExamGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/violations/class/${classCode}/summary`
        );
        const data = await res.json();
        setExamGroups(data || []);
      } catch (err) {
        console.log("Summary fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (classCode) {
      fetchSummary();
    }
  }, [classCode]);

  if (loading) {
    return <div className="violation-page">Loading violations...</div>;
  }

  return (
    <div className="violation-page">
      <h2>🚨 Exam Violation Folders</h2>

      {examGroups.length === 0 ? (
        <p>No submitted exam violations found.</p>
      ) : (
        <div className="violation-folder-grid">
          {examGroups.map((exam) => (
            <div
              key={exam.examId}
              className="violation-folder-card"
              onClick={() =>
                navigate(`/classroom/${classCode}/violations/${exam.examId}`)
              }
            >
              <h3>{exam.examTitle}</h3>
              <p>Total: {exam.totalViolations}</p>
              <p>Pending: {exam.pendingViolations}</p>
              <p>Dismissed: {exam.dismissedViolations}</p>
              <p>Action Taken: {exam.actionTakenViolations}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViolationMonitor;