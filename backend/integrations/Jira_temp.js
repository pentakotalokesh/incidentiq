// backend/utils/jira.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const auth = Buffer.from(
  `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
).toString("base64");

// export async function createJiraTicket({
//   testName,
//   rootCause,
//   suggestedFix,
//   logs,
//   projectId,
// }) {
//   try {
//     const res = await axios.post(
//       `${process.env.JIRA_BASE_URL}/rest/api/3/issue`,
//       {
//         fields: {
//           project: { key: process.env.JIRA_PROJECT_KEY },
//           summary: `🔧 [${testName}] - AI-detected issue`,
//           description: `
// **Root Cause:** ${rootCause}

// **Suggested Fix:** ${suggestedFix}

// **Project:** ${projectId}
// **Test:** ${testName}

// **Log Snippet:**
// \`\`\`
// ${logs?.slice(0, 500)}
// \`\`\`

// Created by IncidentIQ Copilot 🤖
//           `,
//           issuetype: { name: "Bug" },
//           labels: ["incidentiq", "ai-analysis"],
//         },
//       },
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return res.data; // ticket key, url etc.
//   } catch (err) {
//     console.error(
//       "Jira ticket creation failed:",
//       err?.response?.data || err.message
//     );
//     return null;
//   }
// }
export async function createJiraTicket({
  testName,
  rootCause,
  suggestedFix,
  logs,
  projectId,
}) {
  try {
    const res = await axios.post(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue`,
      {
        fields: {
          project: { key: process.env.JIRA_PROJECT_KEY },
          summary: `🔧 [${testName}] - AI-detected issue`,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: `🛠️ Root Cause: ${rootCause}` },
                ],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: `💡 Suggested Fix: ${suggestedFix}` },
                ],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: `🔬 Project: ${projectId}` }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: `🧪 Test: ${testName}` }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "📄 Log Snippet:" }],
              },
              {
                type: "codeBlock",
                attrs: { language: "text" },
                content: [{ type: "text", text: logs?.slice(0, 500) }],
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Created by IncidentIQ Copilot 🤖" },
                ],
              },
            ],
          },
          issuetype: { name: "Bug" },
          labels: ["incidentiq", "ai-analysis"],
        },
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error(
      "Jira ticket creation failed:",
      err?.response?.data || err.message
    );
    return null;
  }
}
