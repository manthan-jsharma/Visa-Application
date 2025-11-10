import express from "express";
import multer from "multer";
import { generateEvaluation } from "../services/evaluationService.js";
import { sendEvaluationEmail } from "../services/emailService.js";
import { PDFParse } from "pdf-parse";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Country and Visa Type Config
const VISA_CONFIG = {
  "United States": {
    types: ["H1B", "F1", "EB1", "EB2"],
    documents: {
      H1B: ["resume", "job_offer", "degree"],
      F1: ["i20", "financial_proof", "resume"],
      EB1: ["resume", "publications", "awards"],
      EB2: ["resume", "degree", "labor_cert"],
    },
  },
  Canada: {
    types: ["Express Entry", "Provincial Nominee", "Study Permit"],
    documents: {
      "Express Entry": ["resume", "language_test", "education_docs"],
      "Provincial Nominee": ["resume", "job_offer", "language_test"],
      "Study Permit": ["acceptance_letter", "financial_proof", "passport"],
    },
  },
  Germany: {
    types: ["Work Visa", "Student Visa", "EU Blue Card"],
    documents: {
      "Work Visa": ["resume", "job_offer", "degree"],
      "Student Visa": [
        "acceptance_letter",
        "financial_proof",
        "language_proof",
      ],
      "EU Blue Card": ["resume", "degree", "job_contract"],
    },
  },
  Australia: {
    types: ["Skilled Migration", "Student Visa", "Work Holiday"],
    documents: {
      "Skilled Migration": ["resume", "skills_assessment", "language_test"],
      "Student Visa": ["acceptance_letter", "financial_proof", "passport"],
      "Work Holiday": ["passport", "police_clearance", "medical"],
    },
  },
};

// GET: Visa Configuration
router.get("/config", (req, res) => {
  res.json(VISA_CONFIG);
});

// POST: Submit Evaluation
router.post("/submit", upload.array("documents"), async (req, res) => {
  try {
    console.log("Received form body:", req.body);
    const { fullName, email, country, visaType, language } = req.body;
    const partnerApiKey = req.headers["x-api-key"] || null;

    // Validate required fields
    if (!fullName || !email || !country || !visaType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No resume file uploaded." });
    }

    const file = req.files[0];
    let resumeText = "";

    if (file.mimetype === "application/pdf") {
      const pdfDataUint8Array = new Uint8Array(file.buffer);
      const parser = new PDFParse({ data: pdfDataUint8Array });
      const data = await parser.getText();
      resumeText = data.text;
    } else if (file.mimetype === "text/plain") {
      resumeText = file.buffer.toString("utf8");
    } else {
      return res
        .status(400)
        .json({ error: "Invalid file type. Please upload a PDF or TXT file." });
    }

    // Generate evaluation score using AI
    const evaluation = await generateEvaluation({
      fullName,
      email,
      country,
      visaType,
      resumeText: resumeText,
      language: language || "en",
    });

    // Apply max score cap from environment
    const MAX_CAP = Number.parseInt(process.env.MAX_SCORE_CAP || 85);
    evaluation.score = Math.min(evaluation.score, MAX_CAP);
    evaluation.maxScoreCap = MAX_CAP;
    evaluation.partnerApiKey = partnerApiKey || null;
    evaluation.language = language || "en";
    evaluation.documents = req.files.map((f) => f.originalname);

    // Save to MongoDB
    const newEvaluation = new (await import("../models/Evaluation.js")).default(
      evaluation
    );
    await newEvaluation.save();
    sendEvaluationEmail(newEvaluation.email, newEvaluation, language || "en");
    res.json({
      success: true,
      evaluation: newEvaluation.toObject(),
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    res
      .status(500)
      .json({ error: "Evaluation failed", details: error.message });
  }
});

// GET: Get Evaluation by ID
router.get("/:id", async (req, res) => {
  try {
    const Evaluation = (await import("../models/Evaluation.js")).default;
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ error: "Not found" });
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
