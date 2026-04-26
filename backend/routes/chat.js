const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getDb } = require("../db");

require("dotenv").config();

console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

// SYSTEM PROMPT
const SYSTEM_PROMPT = `You are MediAgent, an empathetic AI telemedicine prescreener. Your role is to:
1. Auto-detect the user's language and respond in that language naturally.
2. Ask thoughtful follow-up questions about symptom onset, severity (1-10), duration, and associated symptoms.
3. Maintain a professional, compassionate, clinical tone.
4. Never provide a final diagnosis. Always remind users to consult a licensed physician.
5. After gathering enough information, summarize your findings.
6. IMPORTANT: Based on the symptoms described, you MUST suggest appropriate over-the-counter (OTC) or commonly prescribed medications. Include specific medicine names (e.g., Paracetamol, Ibuprofen, Cetirizine, Omeprazole, etc.) with brief dosage guidance when possible. Always add a disclaimer that these are suggestions only and a doctor should confirm.

After your conversational response, append a JSON block in this EXACT format:

---CLINICAL_DATA---
{"symptoms":["symptom1","symptom2"],"risk":"Low|Medium|High","estimate":"Provisional condition estimate","meds":["Medicine 1 (e.g., Paracetamol 500mg - 1 tablet every 6 hours)","Medicine 2 (e.g., Ibuprofen 400mg - after food)"],"advice":"Key advice text","causes":"Possible causes","precautions":"Key precautions","foodsToAvoid":"Foods or substances to avoid","suggestedReplies":["Quick reply 1","Quick reply 2","Quick reply 3"],"lang":"EN"}
---END_CLINICAL_DATA---`;

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// POST /api/chat
router.post("/", async (req, res) => {
  const { session_id, messages } = req.body;

  if (!session_id || !messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "session_id and messages array are required.",
    });
  }

  const db = getDb();
  const lastMsg = messages[messages.length - 1];

  // Save user message
  if (lastMsg && lastMsg.role === "user") {
    db.run(
      "INSERT INTO messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
      [session_id, "user", lastMsg.content, Date.now()]
    );
  }

  try {
    console.log("🚀 CALLING GEMINI API...", MODEL);

    const apiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\nUser: ${lastMsg.content}`,
              },
            ],
          },
        ],
      }
    );

    // Safe extraction
    const fullText =
      apiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!fullText) {
      throw new Error("Empty response from Gemini");
    }

    let displayText = fullText;
    let clinicalData = null;

    // Extract structured JSON block
    const match = fullText.match(
      /---CLINICAL_DATA---([\s\S]*?)---END_CLINICAL_DATA---/
    );

    if (match) {
      displayText = fullText
        .replace(/---CLINICAL_DATA---[\s\S]*?---END_CLINICAL_DATA---/, "")
        .trim();

      try {
        clinicalData = JSON.parse(match[1].trim());
      } catch (e) {
        console.warn("⚠ JSON parse failed:", e.message);
      }
    }

    // Save assistant response
    db.run(
      "INSERT INTO messages (session_id, role, content, data_json, timestamp) VALUES (?, ?, ?, ?, ?)",
      [
        session_id,
        "assistant",
        displayText,
        clinicalData ? JSON.stringify(clinicalData) : null,
        Date.now(),
      ]
    );

    // Update preview
    if (messages.length === 1) {
      const preview =
        lastMsg.content.slice(0, 60) +
        (lastMsg.content.length > 60 ? "..." : "");

      db.run("UPDATE sessions SET preview = ? WHERE id = ?", [
        preview,
        session_id,
      ]);
    }

    res.json({
      reply: displayText,
      clinicalData,
    });

  } catch (err) {
    console.error("❌ GEMINI ERROR FULL:", err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to get AI response. Please try again.",
    });
  }
});

module.exports = router; 