const express = require("express");
const router = express.Router();

const Class = require("../models/Class");

/* =========================
   GET PARTICIPANTS
========================= */

router.get("/participants/:code", async (req,res)=>{

  try{

    const classroom = await Class.findOne({
      code: req.params.code
    })
    .populate("teacher","name email")
    .populate("students","name email");

    if(!classroom){

      return res.status(404).json({
        message:"Class not found"
      });

    }

    res.json({
      teacher: classroom.teacher,
      students: classroom.students
    });

  }
  catch(error){

    res.status(500).json({
      message:error.message
    });

  }

});

module.exports = router;