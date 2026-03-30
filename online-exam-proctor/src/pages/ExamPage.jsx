import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "../styles/exam.css";

function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [violations, setViolations] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  /* ===============================
     Fetch Exam
  =============================== */

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const studentId = localStorage.getItem("userId");

        const res = await fetch(
          `http://localhost:5000/api/exams/exam/${id}?studentId=${studentId}`
        );

        if (!res.ok) {
          const error = await res.json();

          if (error.attemptId) {
            alert("You already attempted this exam");
            navigate("/studentdashboard");
            return;
          }

          alert(error.message);
          navigate("/studentdashboard");
          return;
        }

        const data = await res.json();

        setExam(data);
        setTimeLeft((data.duration || 30) * 60);
      } catch (err) {
        console.log("Fetch exam error:", err);
        alert("Unable to load exam");
        navigate("/studentdashboard");
      }
    };

    fetchExam();
  }, [id, navigate]);

  /* ===============================
     Prevent Page Reload
  =============================== */

  useEffect(() => {
    const warnReload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", warnReload);

    return () => window.removeEventListener("beforeunload", warnReload);
  }, []);

  /* ===============================
     Start Exam
  =============================== */

  const startExam = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

      setExamStarted(true);
    } catch (err) {
      console.log("Fullscreen error:", err);
    }
  };

  /* ===============================
     Timer
  =============================== */

  useEffect(() => {
    if (!examStarted || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, submitted]);

  /* ===============================
     Tab Switch Detection
  =============================== */

  useEffect(() => {
    if (!examStarted) return;

    const handleVisibility = () => {
      if (document.hidden) {
        alert("Tab switching detected!");
        setViolations((v) => v + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [examStarted]);

  /* ===============================
     Fullscreen Exit Detection
  =============================== */

  useEffect(() => {
    if (!examStarted) return;

    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        alert("You exited fullscreen!");
        setViolations((v) => v + 1);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreen);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreen);
  }, [examStarted]);

  /* ===============================
     Disable Copy/Paste
  =============================== */

  useEffect(() => {
    const disable = (e) => e.preventDefault();

    document.addEventListener("copy", disable);
    document.addEventListener("paste", disable);
    document.addEventListener("cut", disable);
    document.addEventListener("contextmenu", disable);

    return () => {
      document.removeEventListener("copy", disable);
      document.removeEventListener("paste", disable);
      document.removeEventListener("cut", disable);
      document.removeEventListener("contextmenu", disable);
    };
  }, []);

  /* ===============================
     Keyboard Blocking
  =============================== */

  useEffect(() => {
    const handleKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "c") ||
        (e.ctrlKey && e.key === "v")
      ) {
        e.preventDefault();
        alert("Shortcut blocked!");
      }
    };

    document.addEventListener("keydown", handleKeys);

    return () => document.removeEventListener("keydown", handleKeys);
  }, []);

  /* ===============================
     Send Webcam Frames
  =============================== */

  const sendFrame = async () => {
    if (!webcamRef.current || submitted || !examStarted) return;

    try {
      const screenshot = webcamRef.current.getScreenshot();

      if (!screenshot) return;

      const image = screenshot.split(",")[1];

      const res = await fetch("http://localhost:5000/api/proctor/frame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: id,
          image,
          studentId: localStorage.getItem("userId"),
          studentName: localStorage.getItem("userName") || "Student",
        }),
      });

      const data = await res.json();

      const canvas = canvasRef.current;
      const video = webcamRef.current.video;

      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");

      const width = video.videoWidth;
      const height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      if (data.boxes) {
        data.boxes.forEach((b) => {
          const [x1, y1, x2, y2] = b.box;

          ctx.strokeStyle = "#ff0000";
          ctx.lineWidth = 2;

          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

          ctx.fillStyle = "#ff0000";
          ctx.font = "16px Arial";

          ctx.fillText(b.label, x1 + 4, y1 - 6);
        });
      }

      if (data.violation) {
        if (!window.lastViolationTime) {
          window.lastViolationTime = 0;
        }

        if (Date.now() - window.lastViolationTime > 5000) {
          setViolations((v) => v + 1);
          console.warn(`Violation detected: ${data.type}`);
          window.lastViolationTime = Date.now();
        }
      }
    } catch (err) {
      console.log("Frame send error:", err);
    }
  };

  useEffect(() => {
    if (!examStarted) return;

    const interval = setInterval(sendFrame, 2000);
    return () => clearInterval(interval);
  }, [examStarted, submitted]);

  /* ===============================
     Handle Answer
  =============================== */

  const handleAnswer = (qIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: value,
    }));
  };

  /* ===============================
     Submit Exam
  =============================== */

  const handleSubmit = async () => {
    if (submitted) return;

    if (Object.keys(answers).length === 0) {
      alert("Please answer at least one question.");
      return;
    }

    setSubmitted(true);

    try {
      const res = await fetch("http://localhost:5000/api/exams/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: id,
          studentId: localStorage.getItem("userId"),
          answers,
          violations,
        }),
      });

      const data = await res.json();

      if (!res.ok && data.attemptId) {
        alert("You already attempted this exam");
        navigate("/studentdashboard");
        return;
      }

      alert(`Exam submitted! Score: ${data.totalScore}`);
      navigate("/studentdashboard");
    } catch (err) {
      console.log("Submit error:", err);
      alert("Submission failed");
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  if (!exam) return <p>Checking exam access...</p>;

  /* ===============================
     Start Screen
  =============================== */

  if (!examStarted) {
    return (
      <div className="start-screen">
        <h2>{exam.title}</h2>
        <p>Duration: {exam.duration} minutes</p>

        <button className="start-btn" onClick={startExam}>
          Start Exam
        </button>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="exam-container">
      <div className="exam-section">
        <div className="exam-header">
          <h2>{exam.title}</h2>

          <div className="exam-timer">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>

        <p>Violations: {violations}</p>

        {exam.questions?.map((q, index) => (
          <div key={index} className="question-card">
            <div>
              {index + 1}. {q.question} ({q.marks || 1} marks)
            </div>

            {exam.type === "quiz" &&
              q.options?.map((opt, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`q-${index}`}
                    checked={answers[index] === i}
                    onChange={() => handleAnswer(index, i)}
                  />
                  {opt}
                </label>
              ))}

            {exam.type === "descriptive" && (
              <textarea
                rows="4"
                value={answers[index] || ""}
                onChange={(e) => handleAnswer(index, e.target.value)}
              />
            )}
          </div>
        ))}

        <button onClick={handleSubmit} disabled={submitted}>
          {submitted ? "Submitting..." : "Submit Exam"}
        </button>
      </div>

      <div className="webcam-section">
        <h3>Live Monitoring</h3>

        <div style={{ position: "relative", width: "640px", height: "480px" }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user",
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ExamPage;