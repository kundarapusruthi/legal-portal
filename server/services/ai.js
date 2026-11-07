import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generate(system, userText) {
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL, // check AI Studio for the current model name
    contents: userText,
    config: { systemInstruction: system },
  });
  return res.text;
}