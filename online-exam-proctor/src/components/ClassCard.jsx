import { useNavigate } from "react-router-dom";
import "../styles/classcard.css";

const ClassCard = ({
  title = "Untitled Class",
  subject = "Not specified",
  code = "N/A",
  studentsCount = 0,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleOpenClass = () => {
    navigate("/classroom");   // 🔥 Simple navigation
  };

  return (
    <div className="class-card">
      {/* Header */}
      <div className="class-card-header">
        <h3 className="class-title">{title}</h3>
        <span className="class-subject">{subject}</span>
      </div>

      {/* Body */}
      <div className="class-card-body">
        <div className="class-info">
          <p className="label">Class Code</p>
          <strong>{code}</strong>
        </div>

        <div className="class-info">
          <p className="label">Participants</p>
          <strong>{studentsCount}</strong>
        </div>
      </div>

      {/* Open Button */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={handleOpenClass}>
          Open Classroom
        </button>
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          className="delete-icon-btn"
          title="Delete class"
          onClick={onDelete}
        >
          🗑️
        </button>
      )}
    </div>
  );
};

export default ClassCard;