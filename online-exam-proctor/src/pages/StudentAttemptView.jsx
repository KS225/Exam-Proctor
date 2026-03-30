import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/attempt.css";

function StudentAttemptView() {

  const { attemptId } = useParams();

  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    fetchAttempt();
  }, []);

  const fetchAttempt = async () => {

    const res = await fetch(
      `http://localhost:5000/api/exams/attempt/${attemptId}`
    );

    const data = await res.json();
    setAttempt(data);
  };

  if (!attempt) return <p>Loading...</p>;

  const exam = attempt.examId;

  const totalMarks = exam.questions.reduce(
    (sum, q) => sum + Number(q.marks || 0),
    0
  );

  const score = attempt.totalScore ?? 
    Object.values(attempt.marksGiven || {}).reduce(
      (sum, m) => sum + Number(m || 0),
      0
    );

  return (

    <div className="attempt-container">

      <div className="attempt-header">
        <h2>{exam.title}</h2>

        <div className="student-info">
          <p><b>Score:</b> {score} / {totalMarks}</p>
          <p><b>Violations:</b> {attempt.violations}</p>
        </div>
      </div>

      <hr />

      <div className="questions-section">

        {exam.questions.map((q, index) => {

          const studentAnswer = attempt.answers[index];

          const isCorrect =
            exam.type === "quiz" &&
            studentAnswer === q.correctAnswer;

          return (

            <div key={index} className="question-card">

              <div className="question-title">
                {index + 1}. {q.question}
                <span className="marks">
                  ({q.marks} marks)
                </span>
              </div>

              {/* Student Answer */}
              <div className="student-answer">
                <b>Your Answer:</b> {studentAnswer ?? "No answer"}
              </div>

              {/* Quiz correct answer */}
              {exam.type === "quiz" && (
                <>
                  <div className="correct-answer">
                    <b>Correct Answer:</b> {q.options[q.correctAnswer]}
                  </div>

                  <div className={
                    isCorrect ? "correct-text" : "wrong-text"
                  }>
                    {isCorrect ? "✔ Correct" : "✖ Wrong"}
                  </div>
                </>
              )}

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default StudentAttemptView;