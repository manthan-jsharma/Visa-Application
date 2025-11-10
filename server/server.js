import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const whitelist = [
  "http://localhost:3000",
  "hhttps://visa-application-brown.vercel.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(join(__dirname, "../client/build")));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import Routes
import evaluationRoutes from "./routes/evaluationRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";

// Routes
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/partners", partnerRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
