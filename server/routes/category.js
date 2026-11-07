import { Router } from "express";
import { predictCategory } from "../services/classifier.js";
import Lawyer from "../models/Lawyer.js";

const router = Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/category  { "problem": "...", "city": "Hyderabad" }
router.post("/", async (req, res) => {
  try {
    const { problem, city } = req.body;
    if (!problem) return res.status(400).json({ error: "Problem text required" });

    const prediction = await predictCategory(problem);

    let lawyers = [];
    if (prediction.category !== "Other") {
      const filter = {
        specialization: new RegExp(`^${escapeRegex(prediction.category)}$`, "i"),
      };
      if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");
      lawyers = await Lawyer.find(filter).sort({ rating: -1, experience: -1 }).limit(5);
    }

    res.json({ ...prediction, lawyers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;