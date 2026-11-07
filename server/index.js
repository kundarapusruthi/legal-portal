import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import lawyerRoutes from "./routes/lawyers.js";
import categoryRoutes from "./routes/category.js";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import analyzeRoutes from "./routes/analyze.js";
import caseRoutes from "./routes/cases.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", rateLimit({ windowMs: 60_000, max: 60 }));

app.use("/api/chat", chatRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/cases", caseRoutes);

await connectDB();
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);