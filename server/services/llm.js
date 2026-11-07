import { generate } from "./ai.js";

const SYSTEM_PROMPT = `- Reply in the same language the user wrote in (English, Hindi, Telugu, etc.).`;

export async function askLegalBot(question, context = "") {
  return generate(SYSTEM_PROMPT, `Context:\n${context}\n\nQuestion: ${question}`);
}