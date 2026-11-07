import { generate } from "./ai.js";

export const CATEGORIES = [
  "Criminal", "Family", "Property", "Consumer",
  "Cyber", "Labour", "Civil", "Other",
];

const SYSTEM_PROMPT = `You classify legal problems from Indian users into exactly one category.
Allowed categories: ${CATEGORIES.join(", ")}.
Respond with ONLY a JSON object, no other text, in this format:
{"category": "<one allowed category>", "confidence": <number between 0 and 1>, "reason": "<one short sentence>"}`;

export async function predictCategory(problem) {
  const text = (await generate(SYSTEM_PROMPT, problem))
    .replace(/```json|```/g, "")
    .trim();
  const parsed = JSON.parse(text);
  if (!CATEGORIES.includes(parsed.category)) parsed.category = "Other";
  return parsed;
}