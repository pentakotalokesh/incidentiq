// backend/routes/logs.js
import express from "express";
import LogEntry from "../models/LogEntry.js";
import { analyzeLogWithGemini } from "../ai/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { source, jobName, logs } = req.body;

  try {
    const aiAnalysis = await analyzeLogWithGemini(logs);

    const newLog = new LogEntry({
      source,
      jobName,
      logs,
      rootCause: aiAnalysis.rootCause,
      suggestedFix: aiAnalysis.suggestedFix,
    });

    const saved = await newLog.save();
    res.status(201).json({ message: "Log analyzed and saved", entry: saved });
  } catch (err) {
    console.error("Log POST Error:", err);
    res.status(500).json({ error: "Log saving failed" });
  }
});

export default router;
