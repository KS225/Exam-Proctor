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
  navigate("/classroom/" + code, {
    state: { title, subject }
  });
};

  return (
    <div className="class-card">
      
      <div className="class-card-header">
        <h3 className="class-title">{title}</h3>
        <span className="class-subject">{subject}</span>
      </div>

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

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button className="open-btn" onClick={handleOpenClass}>
          Open Classroom
        </button>
      </div>

      {onDelete && (
        <button
          className="delete-icon-btn"
          title="Delete class"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          🗑️
        </button>
      )}
    </div>
  );
}; 

export default ClassCard;