import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/exam.css";
import { jsPDF } from "jspdf";

function ExamPreview() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchExam = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/exams/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        setExam(data);
        setLoading(false);

      } catch (err) {

        console.log("Exam preview error:", err);
        setLoading(false);

      }

    };

    fetchExam();

  }, [id]);

  if (loading) return <p>Loading exam...</p>;
  if (!exam) return <p>Exam not found</p>;

  const totalMarks =
    exam.questions?.reduce((sum, q) => sum + (q.marks || 0), 0) || 0;

  const downloadPDF = async () => {

  const doc = new jsPDF();

  let y = 20;

  /* ======================
     LOAD HEADER IMAGE
  ====================== */

  if (exam.headerImage) {

    const imgUrl = `http://localhost:5000${exam.headerImage}`;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imgData = canvas.toDataURL("image/png");

    doc.addImage(imgData, "PNG", 50, y, 110, 30);

    y += 40;
  }

  /* ======================
     TITLE
  ====================== */

  doc.setFontSize(18);
  doc.text(exam.title, 105, y, { align: "center" });

  y += 10;

  /* ======================
     INFO
  ====================== */

  const totalMarks =
    exam.questions?.reduce((sum, q) => sum + (q.marks || 0), 0) || 0;

  doc.setFontSize(12);

  doc.text(`Duration: ${exam.duration} minutes`, 20, y);
  doc.text(`Type: ${exam.type}`, 90, y);
  doc.text(`Total Marks: ${totalMarks}`, 150, y);

  y += 10;

  doc.line(20, y, 190, y);

  y += 10;

  /* ======================
     QUESTIONS
  ====================== */

  exam.questions.forEach((q, index) => {

    doc.text(
      `${index + 1}. ${q.question} (${q.marks} marks)`,
      20,
      y
    );

    y += 8;

    if (exam.type === "quiz") {

      q.options.forEach((opt, i) => {

        doc.text(
          `${String.fromCharCode(65 + i)}. ${opt}`,
          25,
          y
        );

        y += 6;

      });

    }

    if (exam.type === "descriptive") {

      doc.rect(20, y, 170, 20);
      y += 25;

    }

    y += 5;

  });

  doc.save(`${exam.title}.pdf`);
};
  return (

    <div className="paper-container">

      {/* UNIVERSITY HEADER */}

      {exam.headerImage && (

        <div className="paper-header">

          <img
            src={`http://localhost:5000${exam.headerImage}`}
            alt="University Header"
          />

        </div>

      )}
      <button
  className="download-btn"
  onClick={downloadPDF}
>
  Download Question Paper
</button>

      {/* EXAM TITLE */}

      <div className="paper-title">

        <h1>{exam.title}</h1>

      </div>

      {/* EXAM INFO */}

      <div className="paper-info">

        <span>Duration: {exam.duration} minutes</span>
        <span>Type: {exam.type}</span>
        <span>Total Marks: {totalMarks}</span>

      </div>

      <hr />

      {/* QUESTIONS */}

      <div className="paper-questions">

        {exam.questions?.map((q, index) => (

          <div key={index} className="paper-question">

            <h3>
              {index + 1}. {q.question}
              <span className="marks"> ({q.marks} marks)</span>
            </h3>

            {/* QUIZ */}

            {exam.type === "quiz" && (

              <ul className="options">

                {q.options?.map((opt, i) => (

                  <li key={i}>
                    {String.fromCharCode(65 + i)}. {opt}

                    {q.correctAnswer === i && (
                      <span className="correct"> ✓</span>
                    )}

                  </li>

                ))}

              </ul>

            )}

            {/* DESCRIPTIVE */}

            {exam.type === "descriptive" && (

              <textarea
                className="answer-box"
                placeholder="Student will write answer here"
                disabled
              />

            )}

          </div>

        ))}

      </div>

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

    </div>

  );

}

export default ExamPreview;