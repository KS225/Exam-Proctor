import { useEffect, useState } from "react";
import "../styles/classwork.css"
function Classwork() {

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [answers, setAnswers] = useState({});

  const studentId = localStorage.getItem("userId");

  useEffect(() => {

    fetch("http://localhost:5000/api/assignments/ABC123")
      .then(res => res.json())
      .then(setAssignments);

    fetch(`http://localhost:5000/api/assignments/student/${studentId}`)
      .then(res => res.json())
      .then(setSubmissions);

  }, []);

  const isSubmitted = (id) => {
    return submissions.find(s => s.assignmentId === id);
  };

  return (
    <div className="classwork">

      <h2>Classwork</h2>

      {assignments.map(a => {

        const submitted = isSubmitted(a._id);

        return (
          <div key={a._id} className="assignment-card">

            <h3>{a.title}</h3>
            <p>{a.description}</p>

            <p>
              Due: {new Date(a.dueDate).toDateString()}
            </p>

            <p className={submitted ? "submitted" : "pending"}>
              {submitted ? "✅ Submitted" : "⏳ Pending"}
            </p>

            {!submitted && (
              <>
                <textarea
                  placeholder="Your answer"
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [a._id]: e.target.value
                    })
                  }
                />

                <button>
                  Submit
                </button>
              </>
            )}

            {submitted && (
              <div className="result-box">
                <p>Marks: {submitted.marks ?? "Not graded"}</p>
                <p>{submitted.feedback}</p>
              </div>
            )}

          </div>
        );

      })}

    </div>
  );
}

export default Classwork;