import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generate(system, userText) {
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: userText,
    config: { systemInstruction: system },
  });
  return res.text;
}

// Send a PDF/image plus instructions, and ask for JSON back
export async function generateFromFile(system, instruction, buffer, mimeType) {
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: [
      { inlineData: { mimeType, data: buffer.toString("base64") } },
      { text: instruction },
    ],
    config: { systemInstruction: system, responseMimeType: "application/json" },
  });
  return res.text;
}