import { useEffect, useState } from "react";
import "../styles/violation.css";

function StudentViolations() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const studentId = localStorage.getItem("userId");

        const res = await fetch(
          `http://localhost:5000/api/violations/student/${studentId}/actioned`
        );
        const data = await res.json();

        setLogs(data || []);
      } catch (err) {
        console.log("Student violations fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  if (loading) {
    return <div className="violation-page">Loading violation actions...</div>;
  }

  return (
    <div className="violation-page">
      <h2>🚨 Violation Actions</h2>

      {logs.length === 0 ? (
        <p>No violation actions found.</p>
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
                alt="evidence"
              />
            ) : (
              <div>No evidence</div>
            )}

            <div className="info">
              <p>🕒 {new Date(log.actionTakenAt || log.createdAt).toLocaleString()}</p>
              <p>🏷 Type: {log.type || "Violation"}</p>

              {log.violations?.length > 0 && (
                <div>
                  {log.violations.map((v, idx) => (
                    <p key={idx} className="violation-text">⚠ {v}</p>
                  ))}
                </div>
              )}

              <p>
                <strong>Status:</strong> {log.status}
              </p>

              {log.teacherRemark && (
                <p>
                  <strong>Teacher Message:</strong> {log.teacherRemark}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentViolations;