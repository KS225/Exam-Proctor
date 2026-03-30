import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/stream.css";

function TeacherPost({ classCode, refresh }) {

  const { token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const submitPost = async () => {

    if (!title.trim() && !content.trim() && files.length === 0) return;

    const formData = new FormData();

    formData.append("classCode", classCode);
    formData.append("title", title);
    formData.append("content", content);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {

      await fetch("http://localhost:5000/api/stream", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      setTitle("");
      setContent("");
      setFiles([]);

      refresh();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="teacher-post-card">

      <input
        className="post-title"
        type="text"
        placeholder="Announcement title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="post-content"
        placeholder="Write announcement..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="post-actions">

        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        <button className="post-btn" onClick={submitPost}>
          Post
        </button>

      </div>

    </div>
  );
}

export default TeacherPost;