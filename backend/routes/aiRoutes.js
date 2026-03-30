const express = require("express");
const router = express.Router();

const { generateAndSavePaper } = require("../controllers/aiController");

router.post("/generate-save", generateAndSavePaper);

module.exports = router;