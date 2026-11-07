import { Router } from "express";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Lawyer from "../models/Lawyer.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);

// GET /api/appointments/slots?lawyerId=...&date=2026-11-20  (public)
router.get("/slots", async (req, res) => {
  try {
    const { lawyerId, date } = req.query;
    if (!mongoose.isValidObjectId(lawyerId) || !DATE_RE.test(date || ""))
      return res.status(400).json({ error: "Valid lawyerId and date (YYYY-MM-DD) required" });

    const booked = await Appointment.find({
      lawyer: lawyerId,
      date,
      status: { $ne: "cancelled" },
    }).select("timeSlot");

    const taken = booked.map((b) => b.timeSlot);
    res.json({ date, available: SLOTS.filter((s) => !taken.includes(s)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /api/appointments  (login required)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { lawyerId, date, timeSlot, problem } = req.body;

    if (!mongoose.isValidObjectId(lawyerId))
      return res.status(400).json({ error: "Valid lawyerId required" });
    if (!DATE_RE.test(date || ""))
      return res.status(400).json({ error: "Date must be YYYY-MM-DD" });
    if (date < today())
      return res.status(400).json({ error: "Date cannot be in the past" });
    if (!SLOTS.includes(timeSlot))
      return res.status(400).json({ error: `timeSlot must be one of: ${SLOTS.join(", ")}` });

    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ error: "Lawyer not found" });

    const clash = await Appointment.findOne({
      lawyer: lawyerId,
      date,
      timeSlot,
      status: { $ne: "cancelled" },
    });
    if (clash) return res.status(409).json({ error: "That slot is already booked" });

    const appointment = await Appointment.create({
      user: req.userId,
      lawyer: lawyerId,
      date,
      timeSlot,
      problem,
    });
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/appointments/mine  (login required)
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const list = await Appointment.find({ user: req.userId })
      .populate("lawyer", "name city specialization phone")
      .sort({ date: 1, timeSlot: 1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// PATCH /api/appointments/:id/cancel  (login required)
router.patch("/:id/cancel", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ error: "Invalid appointment id" });

    const appt = await Appointment.findOne({ _id: req.params.id, user: req.userId });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    appt.status = "cancelled";
    await appt.save();
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;