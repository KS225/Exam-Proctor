function Participants() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h2>Participants</h2>

      <h3>Teacher</h3>
      <p>Teacher Name</p>

      <h3>Students</h3>
      <ul>
        <li>Student 1</li>
        <li>Student 2</li>
      </ul>

      {user?.role === "teacher" && (
        <button>Remove Student</button>
      )}
    </div>
  );
}

export default Participants;