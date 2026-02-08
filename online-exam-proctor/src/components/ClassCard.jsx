import "../styles/classCard.css";

const ClassCard = ({
  title = "Untitled Class",
  teacher = "Instructor",
  code = "N/A",
  onClick,
}) => {
  return (
    <div className="class-card" onClick={onClick}>
      <div className="class-card-header">
        <h3>{title}</h3>
        <span>{teacher}</span>
      </div>

      <div className="class-card-body">
        <p>Class Code</p>
        <strong>{code}</strong>
      </div>
    </div>
  );
};

export default ClassCard;
