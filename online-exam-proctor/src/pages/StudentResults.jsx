import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import "../styles/studentResult.css"

function StudentResults() {

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttempts();
  }, []);

 const fetchAttempts = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/student/attempts",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      console.log("Failed to fetch attempts");
      setLoading(false);
      return;
    }

    const data = await res.json();

    setAttempts(data);
    setLoading(false);

  } catch (err) {
    console.log("Error fetching attempts:", err);
    setLoading(false);
  }

};

  return (

    <DashboardLayout title="My Results">

      {loading ? (
        <p>Loading results...</p>
      ) : attempts.length === 0 ? (
        <p>No exams attempted yet.</p>
      ) : (

        <table className="results-table">

          <thead>
            <tr>
              <th>Exam</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

{[...attempts]
  .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
  .map((a, index) => {

    const score = a.totalScore ?? 
      Object.values(a.marksGiven || {}).reduce(
        (sum, m) => sum + Number(m || 0),
        0
      );

    const totalMarks = a.examId?.questions?.reduce(
      (sum, q) => sum + Number(q.marks || 0),
      0
    ) || 0;

    const percentage = totalMarks > 0
      ? (score / totalMarks) * 100
      : 0;

    const status = percentage >= 40 ? "Pass" : "Fail";

    return (

      <tr key={a._id}>

        <td>{index + 1}</td>

        <td>{a.examId?.title || "Exam Deleted"}</td>

        <td>
          {score} / {totalMarks}
          <br />
          <span className={status === "Pass" ? "status-pass" : "status-fail"}>
            {status} ({percentage.toFixed(1)}%)
          </span>
        </td>

        <td>
          <button
            className="view-btn"
            onClick={() => navigate(`/result/${a._id}`)}
          >
            View Details
          </button>
        </td>

      </tr>

    );

})}

</tbody>

        </table>

      )}

    </DashboardLayout>

  );

}

export default StudentResults;