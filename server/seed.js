import "dotenv/config";
import mongoose from "mongoose";
import Lawyer from "./models/Lawyer.js";

await mongoose.connect(process.env.MONGO_URI);
await Lawyer.deleteMany({});
await Lawyer.insertMany([
  { name: "Adv. Ravi Kumar", specialization: ["Criminal"], city: "Hyderabad", languages: ["Telugu", "English"], experience: 12, rating: 4.6 },
  { name: "Adv. Meena Reddy", specialization: ["Family", "Property"], city: "Hyderabad", languages: ["Telugu", "Hindi"], experience: 8, rating: 4.4 },
  { name: "Adv. Imran Khan", specialization: ["Cyber", "Consumer"], city: "Hyderabad", languages: ["Hindi", "Urdu", "English"], experience: 6, rating: 4.2 },
  { name: "Adv. Sunita Rao", specialization: ["Labour", "Civil"], city: "Warangal", languages: ["Telugu"], experience: 10, rating: 4.5 },
]);
console.log("Seeded");
process.exit();