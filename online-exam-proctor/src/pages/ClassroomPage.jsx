import { useLocation } from "react-router-dom";

const ClassroomPage = () => {
  const location = useLocation();
  const { title, subject, code } = location.state || {};

  return (
    <div>
      <h1>{title}</h1>
      <p>Subject: {subject}</p>
      <p>Class Code: {code}</p>
    </div>
  );
};

export default ClassroomPage;