import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/violation.css";

function ExamViolationDetails() {
  const { examId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchViolations = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/violations/exam/${examId}`
      );
      const data = await res.json();
      setLogs(data || []);
    } catch (err) {
      console.log("Fetch exam violations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examId) fetchViolations();
  }, [examId]);

  const handleDismiss = async (violationId) => {
    try {
      await fetch(`http://localhost:5000/api/violations/${violationId}/dismiss`, {
        method: "PATCH",
      });
      fetchViolations();
    } catch (err) {
      console.log("Dismiss error:", err);
    }
  };

  const handleTakeAction = async (violationId) => {
    try {
      await fetch(`http://localhost:5000/api/violations/${violationId}/action`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherRemark:
            "You were caught cheating during the exam. Your attempt has been marked as failed and the evidence has been recorded.",
        }),
      });

      fetchViolations();
    } catch (err) {
      console.log("Take action error:", err);
    }
  };

  if (loading) {
    return <div className="violation-page">Loading exam violations...</div>;
  }

  return (
    <div className="violation-page">
      <h2>🚨 Exam Violations</h2>

      {logs.length === 0 ? (
        <p>No violations found for this exam.</p>
      ) : (
        logs.map((log) => (
          <div key={log._id} className="violation-card">
            {log.snapshot ? (
              <img
                src={
                  log.snapshot.startsWith("data:image")
                    ? log.snapshot
                    : `data:image/jpeg;base64,${log.snapshot}`
                }
                alt="frame"
              />
            ) : (
              <div>No image</div>
            )}

            <div className="info">
              <p>🕒 {new Date(log.submittedAt || log.timestamp || log.createdAt).toLocaleString()}</p>
              <p>👤 {log.studentName || "Student"}</p>
              <p>👥 Faces: {log.num_faces || 0}</p>
              <p>🏷 {log.type || "None"}</p>
              <p>Status: {log.status}</p>

              {log.violations?.length > 0 ? (
                <div>
                  {log.violations.map((v, idx) => (
                    <p key={idx} className="violation-text">⚠ {v}</p>
                  ))}
                </div>
              ) : (
                <p className="safe">✅ No violation</p>
              )}

              {log.teacherRemark && (
                <p><strong>Remark:</strong> {log.teacherRemark}</p>
              )}

              {log.status === "pending" && (
                <div className="violation-actions">
                  <button
                    className="dismiss-btn"
                    onClick={() => handleDismiss(log._id)}
                  >
                    Dismiss
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => handleTakeAction(log._id)}
                  >
                    Take Action
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ExamViolationDetails;