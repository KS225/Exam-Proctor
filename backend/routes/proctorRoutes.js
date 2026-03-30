const express = require("express");
const router = express.Router();
const axios = require("axios");
const Violation = require("../models/Violation");

router.post("/frame", async (req, res) => {
  try {
    const { examId, image, studentId, studentName } = req.body;

    console.log("Frame received for exam:", examId);

    const ml = await axios.post("http://localhost:8000/detect", { image });
    const result = ml.data;

    console.log("ML response:", result);

    if (result.violation) {
      try {
        await Violation.create({
          examId,
          studentId,
          studentName,
          type: result.type || null,
          violations: result.violations || [],
          direction: result.direction || "",
          gaze: result.gaze || "",
          objects: result.objects || [],
          num_faces: result.num_faces || 0,
          snapshot: image || "",
          timestamp: new Date(),
          isSubmitted: false,
          submittedAt: null,
        });
      } catch (saveErr) {
        console.error("Violation save error:", saveErr.message);
      }
    }

    const response = {
      boxes: result.boxes || [],
      violation: result.violation || false,
      violations: result.violations || [],
      type: result.type || null,
      num_faces: result.num_faces || 0,
      direction: result.direction || "",
      gaze: result.gaze || "",
      objects: result.objects || [],
    };

    if (global.io) {
      global.io.to(examId).emit("proctorData", {
        image,
        studentId,
        studentName,
        ...response,
      });
    }

    res.json(response);
  } catch (err) {
    console.error("ML server error:", err.message);

    res.status(500).json({
      boxes: [],
      violation: false,
      violations: [],
      type: null,
      num_faces: 0,
      direction: "",
      gaze: "",
      objects: [],
    });
  }
});

module.exports = router;