import { useState, useEffect, useContext } from "react";
import TeacherPost from "./TeacherPost";
import { AuthContext } from "../context/AuthContext";

function Stream({ user, code }) {

  const { token } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/stream/${code}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [code]);

  // Add comment
  const addComment = async (postId) => {

    const text = commentText[postId];
    if (!text?.trim()) return;

    try {

      await fetch(`http://localhost:5000/api/stream/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`   // ⭐ send token
        },
        body: JSON.stringify({
          text
        }),
      });

      setCommentText({
        ...commentText,
        [postId]: ""
      });

      fetchPosts();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="stream-container">

      {/* Teacher Post Form */}
      {user?.role === "teacher" && (
        <TeacherPost classCode={code} refresh={fetchPosts} />
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        posts.map((post) => (
          <div className="post-card" key={post._id}>

            {/* Post Header */}
            <div className="post-header">

              <div className="author-avatar">
                {post.authorRole === "teacher" ? "T" : "S"}
              </div>

              <div className="author-name">
                {post.authorName || "Unknown"}
              </div>

              <div className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </div>

            </div>

            {/* Content */}
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {/* Files */}
            {post.files?.length > 0 && (
              <div className="post-files">
                {post.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:5000/uploads/${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download File
                  </a>
                ))}
              </div>
            )}

            {/* Comments */}
            <div className="comments">

              {post.comments?.map((c, idx) => (
                <div className="comment" key={idx}>

                  <div className="comment-avatar">
                    {c.userRole === "teacher" ? "T" : "S"}
                  </div>

                  <div className="comment-body">
                    <strong>{c.userName}</strong>
                    <p>{c.text}</p>
                  </div>

                </div>
              ))}

              {/* Add comment */}
              <div className="add-comment">

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post._id]: e.target.value
                    })
                  }
                />

                <button onClick={() => addComment(post._id)}>
                  Comment
                </button>

              </div>

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default Stream;