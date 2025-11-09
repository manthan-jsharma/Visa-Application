import mongoose from "mongoose"

const partnerSchema = new mongoose.Schema({
  name: String,
  apiKey: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substr(2, 32),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Partner", partnerSchema)
