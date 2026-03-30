const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const streamController = require("../controllers/streamController");

// CREATE POST
router.post("/", protect, upload.array("files"), streamController.createPost);

// GET POSTS
router.get("/:classCode", streamController.getPosts);

// ADD COMMENT
router.post("/comment/:postId", protect, streamController.addComment);

module.exports = router;