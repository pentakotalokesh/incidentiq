// backend/routes/jira.js
import express from "express";
import { createJiraTicket } from "../integrations/Jira_temp.js";

const router = express.Router();

// POST /jira
router.post("/", async (req, res) => {
  const { testName, rootCause, suggestedFix, logs, projectId } = req.body;

  if (!testName || !rootCause || !suggestedFix || !logs || !projectId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const jiraResponse = await createJiraTicket({
      testName,
      rootCause,
      suggestedFix,
      logs,
      projectId,
    });

    if (!jiraResponse) {
      return res.status(500).json({ error: "Failed to create Jira ticket" });
    }

    res.status(201).json({
      message: "Jira ticket created successfully",
      ticket: jiraResponse,
    });
  } catch (err) {
    console.error("Jira Route Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
