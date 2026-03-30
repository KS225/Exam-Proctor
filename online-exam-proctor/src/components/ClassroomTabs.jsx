function ClassroomTabs({ setActiveTab }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <button onClick={() => setActiveTab("stream")}>Stream</button>
      {/* <button onClick={() => setActiveTab("classwork")}>Classwork</button> */}
      <button onClick={() => setActiveTab("participants")}>Participants</button>
      <button onClick={() => setActiveTab("exams")}>Exams</button>
    </div>
  );
}

export default ClassroomTabs;