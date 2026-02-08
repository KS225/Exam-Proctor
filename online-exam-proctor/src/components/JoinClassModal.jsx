import { useState } from "react";
import "../styles/modal.css";

function JoinClassModal({ onClose, onJoin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const classCode = e.target.code.value.trim().toUpperCase();

    try {
      const res = await fetch("http://localhost:5000/api/student/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ code: classCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to join class");
        setLoading(false);
        return;
      }

      // ✅ Send real class data to dashboard
      onJoin(data.class);
      onClose();
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Join Class</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="code"
            placeholder="Enter Class Code"
            required
          />

          {error && <p className="error-text">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn create" disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinClassModal;
