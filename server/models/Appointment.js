import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
    date: { type: String, required: true },     // "YYYY-MM-DD"
    timeSlot: { type: String, required: true }, // "10:00"
    problem: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);