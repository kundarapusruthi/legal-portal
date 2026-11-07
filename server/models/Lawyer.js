import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: [String],
  city: { type: String, required: true },
  languages: [String],
  experience: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  phone: String,
  email: String,
});

export default mongoose.model("Lawyer", lawyerSchema);