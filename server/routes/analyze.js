import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { analyzeDocument } from "../services/analyzer.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const LANGUAGES = ["English", "Hindi", "Telugu"];

// POST /api/analyze  (login required, multipart form: file + language)
router.post("/", requireAuth, (req, res) => {
  upload.single("file")(req, res, async (uploadErr) => {
    if (uploadErr)
      return res.status(400).json({
        error: uploadErr.code === "LIMIT_FILE_SIZE" ? "File is too large (max 5 MB)" : "Upload failed",
      });

    const file = req.file;
    if (!file) return res.status(400).json({ error: "Please choose a PDF file" });

    const isPdf = file.buffer.subarray(0, 5).toString() === "%PDF-";
    if (!isPdf) return res.status(400).json({ error: "Only PDF files are supported" });

    const language = LANGUAGES.includes(req.body.language) ? req.body.language : "English";

    try {
      const result = await analyzeDocument(file.buffer, "application/pdf", language);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message || "Could not analyse the document" });
    }
  });
});

export default router;