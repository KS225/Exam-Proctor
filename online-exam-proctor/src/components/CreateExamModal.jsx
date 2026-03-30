import { useState, useEffect } from "react";
import "../styles/CreateExamModal.css";

function CreateExamModal({ code, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [headerImage, setHeaderImage] = useState(null);

  // 🔥 AI STATES
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  const [examType, setExamType] = useState("quiz");

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      marks: 1,
    },
  ]);

  const handleQuestionChange = (i, val) => {
    const updated = [...questions];
    updated[i].question = val;
    setQuestions(updated);
  };

  const handleOptionChange = (qi, oi, val) => {
    const updated = [...questions];
    if (!updated[qi].options) {
      updated[qi].options = ["", "", "", ""];
    }
    updated[qi].options[oi] = val;
    setQuestions(updated);
  };

  const handleMarksChange = (i, val) => {
    const updated = [...questions];
    updated[i].marks = Number(val);
    setQuestions(updated);
  };

  const handleCorrectAnswer = (i, val) => {
    const updated = [...questions];
    updated[i].correctAnswer = Number(val);
    setQuestions(updated);
  };

  const addQuestion = () => {
    if (examType === "quiz") {
      setQuestions([
        ...questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          marks: 1,
        },
      ]);
    } else {
      setQuestions([
        ...questions,
        {
          question: "",
          marks: 1,
        },
      ]);
    }
  };

  const removeQuestion = (i) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, index) => index !== i));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("classCode", code);
      formData.append("type", examType);
      formData.append("duration", duration);
      formData.append("questions", JSON.stringify(questions));

      if (headerImage) {
        formData.append("headerImage", headerImage);
      }

      const res = await fetch("http://localhost:5000/api/exams/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create exam");
      }

      onCreated();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Failed to create exam");
    }
  };

  useEffect(() => {
    if (examType === "quiz") {
      setQuestions([
        {
          question: "",
          marks: 1,
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ]);
    } else {
      setQuestions([
        {
          question: "",
          marks: 1,
        },
      ]);
    }
  }, [examType]);

  // 🔥 AI GENERATE
  const generateAIExam = async () => {
    try {
      if (!title || !subject || !topic) {
        alert("Please fill title, subject and topic");
        return;
      }

      setLoading(true);

      const res = await fetch("http://localhost:5000/api/ai/generate-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          count: Number(count),
          type: examType,
          title,
          duration: Number(duration),
          classCode: code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        throw new Error(data.message || "AI generation failed");
      }

      alert("AI Exam Created!");
      onCreated();
      onClose();
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-modal-overlay">
      <div className="exam-modal">
        <div className="modal-header">
          <h2>Create Exam</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="exam-details">
          <div className="input-group">
            <label>Upload University Header</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeaderImage(e.target.files[0])}
            />
          </div>

          <div className="input-group">
            <label>Exam Title</label>
            <input
              placeholder="Enter exam title (e.g. Midterm 1)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Exam Type</label>
            <select
              value={examType}
              onChange={(e) => {
                const newType = e.target.value;

                if (questions.length > 0) {
                  const confirmChange = window.confirm(
                    "Changing exam type will reset all questions. Continue?"
                  );
                  if (!confirmChange) return;
                }

                setExamType(newType);
              }}
            >
              <option value="quiz">Quiz</option>
              <option value="descriptive">Descriptive</option>
            </select>
          </div>

          <div className="input-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Subject</label>
            <input
              placeholder="e.g. Operating Systems"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Topic</label>
            <input
              placeholder="e.g. Deadlock"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="input-group">
            <label>No. of Questions</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
        </div>

        <div className="questions-section">
          <h3>Questions</h3>

          {questions.map((q, index) => (
            <div key={index} className="question-card">
              <div className="question-header">
                <span>Question {index + 1}</span>
                <button
                  className="delete-btn"
                  onClick={() => removeQuestion(index)}
                >
                  Delete
                </button>
              </div>

              <textarea
                placeholder="Enter question"
                value={q.question || ""}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />

              <div className="marks-row">
                <label>Marks per question</label>
                <input
                  type="number"
                  value={q.marks}
                  onChange={(e) => handleMarksChange(index, e.target.value)}
                />
              </div>

              {examType === "quiz" && (
                <>
                  <div className="options-grid">
                    {(q.options || ["", "", "", ""]).map((opt, i) => (
                      <input
                        key={i}
                        placeholder={`Option ${i + 1}`}
                        value={opt || ""}
                        onChange={(e) =>
                          handleOptionChange(index, i, e.target.value)
                        }
                      />
                    ))}
                  </div>

                  <select
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleCorrectAnswer(index, Number(e.target.value))
                    }
                    className="correct-select"
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </>
              )}
            </div>
          ))}

          <button className="add-question-btn" onClick={addQuestion}>
            + Add Question
          </button>
        </div>

        <div className="modal-actions">
          <button
            className="primary-btn"
            onClick={generateAIExam}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>

          <button className="primary-btn" onClick={handleSubmit}>
            Create Exam
          </button>

          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateExamModal;