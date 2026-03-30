const { GoogleGenerativeAI } = require("@google/generative-ai");
const Exam = require("../models/Exam");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateAndSavePaper = async (req, res) => {
  try {
    const { subject, topic, difficulty, count, type, classCode, title, duration } = req.body;
    // Calculate a safe limit: (Number of questions * average tokens) + a small buffer
    const safeLimit = Math.min((count * 250), 4096);
    // 1. Initialize the model with your generationConfig
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 1.0,      // As per your format
        maxOutputTokens: safeLimit, // Dynamically set
        responseMimeType: "application/json" // Forces JSON structure
      },
    });

    // 2. Define the prompt text based on your logic
    let promptText = "";
    if (type === "quiz") {
      promptText = `Generate a JSON array of exactly ${count} multiple-choice questions. 
      Format: [{"question": "string", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "type": "quiz"}]
      Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}. 
      Return ONLY the JSON array.`;
    } else {
      promptText = `Generate a JSON array of exactly ${count} descriptive questions. 
      Format: [{"question": "string", "answerText": "string", "type": "descriptive"}]
      Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}. 
      Return ONLY the JSON array.`;
    }

    // 3. Integrate the "contents" format structure
    // The SDK's generateContent method accepts the "contents" array directly
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ]
    });

    // --- Processing Response ---
    if (!result || !result.response) {
      throw new Error("No response received from Google AI");
    }

    const text = result.response.text();
    
    // Robust Cleaning: Extract anything between [ and ]
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");
    
    const questions = JSON.parse(jsonMatch[0]);

    // Save to Database
    const exam = await Exam.create({
      title,
      duration,
      type,
      classCode,
      questions
    });

    res.json({ message: "AI Exam Created Successfully", exam });

  } catch (err) {
    console.error("AI SERVER ERROR:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Exam = require("../models/Exam");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.generateAndSavePaper = async (req, res) => {
//   try {
//     const {
//       subject,
//       topic,
//       difficulty,
//       count,
//       type,
//       classCode,
//       title,
//       duration
//     } = req.body;

//     // ✅ ONLY WORKING MODEL FOR YOUR SETUP
//     const model = genAI.getGenerativeModel({
//       model: "gemini-pro"
//     });

//     let prompt = "";

//     // ================= QUIZ =================
//     if (type === "quiz") {
//       prompt = `
// Generate ${count} MCQ questions in JSON format.

// [
//   {
//     "question": "string",
//     "options": ["A", "B", "C", "D"],
//     "correctAnswer": 0,
//     "type": "quiz"
//   }
// ]

// RULES:
// - Return ONLY JSON array
// - No explanation
// - No extra text

// Subject: ${subject}
// Topic: ${topic}
// Difficulty: ${difficulty}
// `;
//     }

//     // ================= DESCRIPTIVE =================
//     else {
//       prompt = `
// Generate ${count} descriptive questions in JSON format.

// [
//   {
//     "question": "string",
//     "answerText": "string",
//     "type": "descriptive"
//   }
// ]

// RULES:
// - Return ONLY JSON array
// - No explanation
// - No extra text

// Subject: ${subject}
// Topic: ${topic}
// Difficulty: ${difficulty}
// `;
//     }

//     // ✅ CORRECT CALL (IMPORTANT)
//     const result = await model.generateContent(prompt);

//     let text = result.response.text();

//     console.log("RAW AI OUTPUT:\n", text);

//     // ✅ CLEAN JSON
//     const match = text.match(/\[.*\]/s);
//     text = match ? match[0] : text;

//     let questions;

//     try {
//       questions = JSON.parse(text);
//     } catch (err) {
//       return res.status(500).json({
//         message: "Invalid JSON from AI",
//         raw: text
//       });
//     }

//     // ✅ SAVE TO DB
//     const exam = await Exam.create({
//       title,
//       duration,
//       type,
//       classCode,
//       questions
//     });

//     res.json({
//       message: "AI Exam Created Successfully",
//       exam
//     });

//   } catch (err) {
//     console.error("AI ERROR:", err);

//     res.status(500).json({
//       message: err.message || "AI generation failed"
//     });
//   }
// };