import express from "express"
import multer from "multer"
import { generateEvaluation } from "../services/evaluationService.js"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

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
      "Student Visa": ["acceptance_letter", "financial_proof", "language_proof"],
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
}

// GET: Visa Configuration
router.get("/config", (req, res) => {
  res.json(VISA_CONFIG)
})

// POST: Submit Evaluation
router.post("/submit", upload.array("documents"), async (req, res) => {
  try {
    const { fullName, email, country, visaType, partnerApiKey } = req.body

    // Validate required fields
    if (!fullName || !email || !country || !visaType) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Generate evaluation score using AI
    const evaluation = await generateEvaluation({
      fullName,
      email,
      country,
      visaType,
      documents: req.files || [],
      documentPaths: req.files?.map((f) => f.path) || [],
    })

    // Apply max score cap from environment
    const MAX_CAP = Number.parseInt(process.env.MAX_SCORE_CAP || 85)
    evaluation.score = Math.min(evaluation.score, MAX_CAP)
    evaluation.maxScoreCap = MAX_CAP
    evaluation.partnerApiKey = partnerApiKey || null

    // Save to MongoDB
    const newEvaluation = new (await import("../models/Evaluation.js")).default(evaluation)
    await newEvaluation.save()

    res.json({
      success: true,
      evaluation: {
        id: newEvaluation._id,
        score: newEvaluation.score,
        summary: newEvaluation.summary,
      },
    })
  } catch (error) {
    console.error("Evaluation error:", error)
    res.status(500).json({ error: "Evaluation failed", details: error.message })
  }
})

// GET: Get Evaluation by ID
router.get("/:id", async (req, res) => {
  try {
    const Evaluation = (await import("../models/Evaluation.js")).default
    const evaluation = await Evaluation.findById(req.params.id)
    if (!evaluation) return res.status(404).json({ error: "Not found" })
    res.json(evaluation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
