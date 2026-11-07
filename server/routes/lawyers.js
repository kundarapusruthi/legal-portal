import { Router } from "express";
import Lawyer from "../models/Lawyer.js";
import mongoose from "mongoose";

const router = Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/lawyers?specialization=Criminal&city=Hyderabad
router.get("/", async (req, res) => {
  try {
    const { specialization, city } = req.query;
    const filter = {};
    if (specialization)
      filter.specialization = new RegExp(`^${escapeRegex(specialization)}$`, "i");
    if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");

    const lawyers = await Lawyer.find(filter).sort({ rating: -1, experience: -1 });
    res.json(lawyers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /api/lawyers  (add a lawyer)
router.post("/", async (req, res) => {
  try {
    const lawyer = await Lawyer.create(req.body);
    res.status(201).json(lawyer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// GET /api/lawyers/:id
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid lawyer id" });
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ error: "Lawyer not found" });
    res.json(lawyer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;