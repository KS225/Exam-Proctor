import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/examResults.css";

function ExamResults() {

  const { examId } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [examId]);

  const fetchResults = async () => {

    try {

      const res = await fetch(
        `http://localhost:5000/api/exams/results/${examId}`
      );

      const data = await res.json();

      setResults(data);
      setLoading(false);

    } catch (err) {

      console.log("Error fetching results:", err);
      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="results-container">
        <p>Loading results...</p>
      </div>
    );
  }

  return (

    <div className="results-container">

      <div className="results-header">
        <h2>Exam Results</h2>
      </div>

      {results.length === 0 ? (

        <p className="no-results">
          No students have submitted this exam yet.
        </p>

      ) : (

        <table className="results-table">

          <thead>
            <tr>
              <th>Rank</th> {/* ✅ ADD */}
              <th>Student</th>
              <th>Score</th>
              <th>Status</th>
              <th>Violations</th>
              <th>Attempt</th>
            </tr>
          </thead>

          <tbody>

{[...results]
  .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
  .map((r, index) => {

    const score = r.totalScore ?? 
      Object.values(r.marksGiven || {}).reduce(
        (sum, m) => sum + Number(m?.score ?? m ?? 0),
        0
      );

    const totalMarks = r.examId?.questions?.reduce(
      (sum, q) => sum + Number(q.marks || 0),
      0
    ) || 0;

    const percentage = totalMarks > 0
      ? (score / totalMarks) * 100
      : 0;

    const status =
      r.violations > 3
        ? "Disqualified"
        : percentage >= 40
        ? "Pass"
        : "Fail";

    return (

      <tr key={r._id}>

        {/* ✅ RANK */}
        <td>{index + 1}</td>

        <td>
          {r.studentId?.name || "Unknown"}
        </td>

        <td className="score-cell">
          {score} / {totalMarks}
        </td>

        <td>
          <span className={
            status === "Pass"
              ? "status-pass"
              : status === "Disqualified"
              ? "status-disqualified"
              : "status-fail"
          }>
            {status}
          </span>
        </td>

        <td>
          {r.violations > 2 ? (
            <span className="violation-high">
              {r.violations} ⚠
            </span>
          ) : (
            <span className="violation-normal">
              {r.violations}
            </span>
          )}
        </td>

        <td>
          <button
            className="view-btn"
            onClick={() =>
              navigate(`/attempt/${r._id}`)
            }
          >
            View Attempt
          </button>
        </td>

      </tr>

    );

})}

</tbody>

        </table>

      )}

    </div>

  );

}

export default ExamResults;