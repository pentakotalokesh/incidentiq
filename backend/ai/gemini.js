// backend/ai/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeLogWithGemini(logText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an AI DevOps assistant. Analyze the following log and respond in JSON format like:
{
  "rootCause": "...",
  "suggestedFix": "..."
}

Log:
${logText}
`;

  try {
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = await result.response.text();

    // Attempt to parse JSON from response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);

    throw new Error("Gemini response not in expected format");
  } catch (err) {
    console.error("Gemini Error:", err.message);
    return {
      rootCause: "Unknown",
      suggestedFix: "Manual review required",
    };
  }
}
