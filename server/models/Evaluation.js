import mongoose from "mongoose"

const evaluationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  country: String,
  visaType: String,
  documents: [String], // file paths
  score: Number,
  summary: String,
  maxScoreCap: Number,
  partnerApiKey: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Evaluation", evaluationSchema)
