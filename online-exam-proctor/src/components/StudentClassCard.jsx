import "../styles/classcard.css";

const StudentClassCard = ({
  title,
  subject = "Not specified",
  code,
  teacherName = "Unknown",
  studentsCount = 0,
}) => {
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
          <p className="label">Teacher</p>
          <strong>{teacherName}</strong>
        </div>

        <div className="class-info">
          <p className="label">Class Code</p>
          <strong>{code}</strong>
        </div>

        <div className="class-info">
          <p className="label">Participants</p>
          <strong>{studentsCount}</strong>
        </div>
      </div>
    </div>
  );
};

export default StudentClassCard;