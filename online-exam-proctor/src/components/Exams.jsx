import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateExamModal from "../components/CreateExamModal";
import "../styles/exams.css";

import { useParams } from "react-router-dom";

function Exams() {
  const { code } = useParams();

  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
const role = localStorage.getItem("role")?.toLowerCase();
  const navigate = useNavigate();
console.log("ROLE:", role);
console.log("CODE:", code);
useEffect(() => {
  if (code) {
    fetchExams();
  }
}, [code]);

  const fetchExams = async () => {

    try {

      const res = await fetch(
        `http://localhost:5000/api/exams/class/${code}`
      );

      const data = await res.json();

      setExams(data);

    } catch (err) {

      console.log("Error fetching exams:", err);

    }

  };

  return (

    <div className="exams-container">

      <h2>Exams</h2>

      {/* CREATE EXAM BUTTON */}

      {role === "teacher" && (

        <button
          className="create-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Exam
        </button>

      )}

      {/* CREATE EXAM MODAL */}

      {showModal && (

        <CreateExamModal
          code={code}
          onClose={() => setShowModal(false)}
          onCreated={fetchExams}
        />

      )}

      {/* EXAMS LIST */}

      {exams.map((exam) => (

        <div
          key={exam._id}
          className="exam-card"
        >

          <div className="exam-info">

            <h3>{exam.title}</h3>

            <p>
              Duration: {exam.duration} minutes
            </p>

            <p>
              Type: {exam.type}
            </p>

          </div>

          {/* STUDENT START */}

          {role === "student" && (

            <button
              className="start-btn"
              onClick={() => navigate(`/exam/${exam._id}`)}
            >
              Start Exam
            </button>

          )}

          {/* TEACHER BUTTONS */}

          {role === "teacher" && (

            <div className="teacher-actions">

              <button
                className="view-btn"
                onClick={() => navigate(`/exam-preview/${exam._id}`)}
              >
                View Paper
              </button>

              <button
                className="results-btn"
                onClick={() => navigate(`/exam-results/${exam._id}`)}
              >
                View Results
              </button>

            </div>

          )}

        </div>

      ))}

    </div>

  );

}

export default Exams;