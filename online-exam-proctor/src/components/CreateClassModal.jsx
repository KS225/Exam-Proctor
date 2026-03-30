import "../styles/modal.css";

function CreateClassModal({ onClose, onCreate }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const newClass = {
      title: e.target.title.value,
      subject: e.target.subject.value,   // ✅ ADD THIS
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    onCreate(newClass);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create Class</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Class Name (e.g. BE)"
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject (e.g. WebX)"
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateClassModal;