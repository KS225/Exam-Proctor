import { useState, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Stream from "./Stream";
import Classwork from "./Classwork";
import Participants from "./Participants";
import Exams from "./Exams";
import ViolationMonitor from "../pages/ViolationMonitor";
import "../styles/classroom.css";

function ClassroomLayout() {
  const [activeTab, setActiveTab] = useState("stream");
  const location = useLocation();
  const { code } = useParams();
  const { user } = useContext(AuthContext);

  const title = location.state?.title || "Class Title";
  const subject = location.state?.subject || "Subject";

  const isTeacher =
    user?.role === "teacher" || user?.role === "TEACHER";
  const isStudent =
    user?.role === "student" || user?.role === "STUDENT";

  useEffect(() => {
    if (!isTeacher && activeTab === "violations") {
      setActiveTab("stream");
    }
  }, [isTeacher, activeTab]);

  return (
    <div className="classroom-container">
      <div className="classroom-header">
        <h2>{title}</h2>
        <p>{subject}</p>
        <span>Class Code: {code}</span>
      </div>

      <div className="classroom-tabs">
        <button
          className={activeTab === "stream" ? "active" : ""}
          onClick={() => setActiveTab("stream")}
        >
          Stream
        </button>

        {isTeacher && (
          <button
            className={activeTab === "violations" ? "active" : ""}
            onClick={() => setActiveTab("violations")}
          >
            🚨 Violations
          </button>
        )}

        <button
          className={activeTab === "participants" ? "active" : ""}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>

        <button
          className={activeTab === "exams" ? "active" : ""}
          onClick={() => setActiveTab("exams")}
        >
          Exams
        </button>
      </div>

      <div className="classroom-content">
        {activeTab === "stream" && <Stream user={user} code={code} />}
        {activeTab === "classwork" && <Classwork />}
        {activeTab === "participants" && <Participants code={code} />}
        {activeTab === "exams" && <Exams code={code} />}
        {activeTab === "violations" && isTeacher && (
          <ViolationMonitor classCode={code} />
        )}
      </div>
    </div>
  );
}

export default ClassroomLayout;