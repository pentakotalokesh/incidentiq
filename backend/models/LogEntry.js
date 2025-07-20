// backend/models/LogEntry.js
import mongoose from "mongoose";

const logEntrySchema = new mongoose.Schema({
  source: String,
  jobName: String,
  logs: String,
  rootCause: String,
  suggestedFix: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LogEntry", logEntrySchema);
