const StreamPost = require("../models/StreamPost");

// CREATE POST
exports.createPost = async (req, res) => {
  try {

    console.log("REQ USER:", req.user); // ⭐ Debug line

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { classCode, title, content } = req.body;

    const files = req.files ? req.files.map(f => f.filename) : [];

    const post = await StreamPost.create({
      classCode,
      title,
      content,
      files,
      authorId: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
    });

    res.json(post);

  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET POSTS
exports.getPosts = async (req, res) => {
  try {

    console.log("Requested classCode:", req.params.classCode);

    const posts = await StreamPost.find({
      classCode: req.params.classCode
    });

    console.log("Posts returned from DB:", posts);

    res.json(posts);

  } catch (err) {
    console.error("GET POSTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ADD COMMENT
exports.addComment = async (req, res) => {
  try {

    console.log("REQ USER:", req.user); // ⭐ Debug line

    if (!req.user) {
  return res.status(401).json({ message: "User not authenticated" });
}

if (req.user.role !== "teacher") {
  return res.status(403).json({ message: "Only teachers can create posts" });
}

    const { text } = req.body;

    const post = await StreamPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      text
    });

    await post.save();

    res.json(post);

  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};