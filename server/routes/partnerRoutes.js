import express from "express"
import Evaluation from "../models/Evaluation.js"
import Partner from "../models/Partner.js"

const router = express.Router()

// Middleware: Verify API Key
const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"]
  if (!apiKey) return res.status(401).json({ error: "API key required" })

  const partner = await Partner.findOne({ apiKey })
  if (!partner) return res.status(401).json({ error: "Invalid API key" })

  req.partner = partner
  next()
}

// GET: Partner's Evaluations
router.get("/evaluations", verifyApiKey, async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ partnerApiKey: req.partner.apiKey })
    res.json(evaluations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST: Create Partner
router.post("/create", async (req, res) => {
  try {
    const newPartner = new Partner({ name: req.body.name })
    await newPartner.save()
    res.json({ apiKey: newPartner.apiKey, message: "Partner created" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
