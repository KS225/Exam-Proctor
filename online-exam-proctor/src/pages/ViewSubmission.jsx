import { useEffect, useState } from "react";
import "../styles/viewSubmission.css";
function ViewSubmissions({ assignmentId }) {

  const [subs, setSubs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/assignments/submissions/${assignmentId}`)
      .then(res => res.json())
      .then(setSubs);
  }, [assignmentId]);

  const grade = async (id, marks, feedback) => {

    await fetch("http://localhost:5000/api/assignments/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        submissionId: id,
        marks,
        feedback
      })
    });

    alert("Graded!");
  };

  return (
    <div>

      <h2>Submissions</h2>

      {subs.map(s => (
        <div key={s._id} className="submission-card">

          <p>Student: {s.studentId}</p>
          <p>Answer: {s.answer}</p>

          <input placeholder="Marks" id={`m-${s._id}`} />
          <input placeholder="Feedback" id={`f-${s._id}`} />

          <button onClick={() =>
            grade(
              s._id,
              document.getElementById(`m-${s._id}`).value,
              document.getElementById(`f-${s._id}`).value
            )
          }>
            Grade
          </button>

        </div>
      ))}

    </div>
  );
}

export default ViewSubmissions;