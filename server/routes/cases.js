import { Router } from "express";
import mongoose from "mongoose";
import CaseTrack from "../models/CaseTrack.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const TYPES = ["criminal", "civil", "consumer", "family"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// GET /api/cases/mine
router.get("/mine", async (req, res) => {
  try {
    res.json(await CaseTrack.find({ user: req.userId }).sort({ createdAt: -1 }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /api/cases
router.post("/", async (req, res) => {
  try {
    const title = str(req.body.title, 120);
    if (!title) return res.status(400).json({ error: "Case title is required" });
    if (!TYPES.includes(req.body.type)) return res.status(400).json({ error: "Invalid case type" });

    const nextHearing = str(req.body.nextHearing, 10);
    if (nextHearing && !DATE_RE.test(nextHearing))
      return res.status(400).json({ error: "Hearing date must be YYYY-MM-DD" });

    const created = await CaseTrack.create({
      user: req.userId,
      title,
      type: req.body.type,
      court: str(req.body.court, 120),
      caseNumber: str(req.body.caseNumber, 60),
      nextHearing,
      notes: str(req.body.notes, 500),
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// PATCH /api/cases/:id  (update stage, hearing date, notes, etc.)
router.patch("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid case id" });

    const c = await CaseTrack.findOne({ _id: req.params.id, user: req.userId });
    if (!c) return res.status(404).json({ error: "Case not found" });

    const b = req.body;
    if (b.title !== undefined) {
      const t = str(b.title, 120);
      if (!t) return res.status(400).json({ error: "Case title cannot be empty" });
      c.title = t;
    }
    if (b.court !== undefined) c.court = str(b.court, 120);
    if (b.caseNumber !== undefined) c.caseNumber = str(b.caseNumber, 60);
    if (b.notes !== undefined) c.notes = str(b.notes, 500);
    if (b.nextHearing !== undefined) {
      const d = str(b.nextHearing, 10);
      if (d && !DATE_RE.test(d)) return res.status(400).json({ error: "Hearing date must be YYYY-MM-DD" });
      c.nextHearing = d;
    }
    if (b.stage !== undefined) {
      const s = Number(b.stage);
      if (!Number.isInteger(s) || s < 0 || s > 20) return res.status(400).json({ error: "Invalid stage" });
      c.stage = s;
    }

    await c.save();
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// DELETE /api/cases/:id
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid case id" });
    const r = await CaseTrack.deleteOne({ _id: req.params.id, user: req.userId });
    if (r.deletedCount === 0) return res.status(404).json({ error: "Case not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;