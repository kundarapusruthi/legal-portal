import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxlength: 120 },
    type: { type: String, enum: ["criminal", "civil", "consumer", "family"], required: true },
    court: { type: String, maxlength: 120, default: "" },
    caseNumber: { type: String, maxlength: 60, default: "" },
    stage: { type: Number, default: 0, min: 0, max: 20 },
    nextHearing: { type: String, default: "" }, // "YYYY-MM-DD" or empty
    notes: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("CaseTrack", caseSchema);