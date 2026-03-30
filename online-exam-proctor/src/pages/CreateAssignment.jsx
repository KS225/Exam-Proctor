import { useState } from "react";

function CreateAssignment() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  const handleSubmit = async () => {

    await fetch("http://localhost:5000/api/assignments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        classCode: "ABC123", // dynamic later
        teacherId: localStorage.getItem("userId")
      })
    });

    alert("Assignment Created!");
  };

  return (
    <div className="assignment-form">

      <h2>Create Assignment</h2>

      <input
        placeholder="Title"
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <textarea
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setForm({ ...form, dueDate: e.target.value })
        }
      />

      <button onClick={handleSubmit}>
        Create
      </button>

    </div>
  );
}

export default CreateAssignment;