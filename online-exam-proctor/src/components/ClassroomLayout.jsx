import { useState } from "react";
import "../styles/classroom.css";

function ClassroomLayout() {
  const [activeTab, setActiveTab] = useState("stream");

  return (
    <div className="classroom-container">
      
      {/* Header */}
      <div className="classroom-header">
        <h1>Computer Science</h1>
        <p>Section A • 2026</p>
      </div>

      {/* Tabs */}
      <div className="classroom-tabs">
        <button 
          className={activeTab === "stream" ? "active" : ""}
          onClick={() => setActiveTab("stream")}
        >
          Stream
        </button>

        <button 
          className={activeTab === "classwork" ? "active" : ""}
          onClick={() => setActiveTab("classwork")}
        >
          Classwork
        </button>

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

      {/* Content */}
      <div className="classroom-content">
        {activeTab === "stream" && <h2>Stream Section</h2>}
        {activeTab === "classwork" && <h2>Classwork Section</h2>}
        {activeTab === "participants" && <h2>Participants Section</h2>}
        {activeTab === "exams" && <h2>Exams Section</h2>}
      </div>

    </div>
  );
}

export default ClassroomLayout;