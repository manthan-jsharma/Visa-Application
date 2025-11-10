import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const MAX_SCORE_CAP = parseInt(process.env.MAX_SCORE_CAP || "85", 10);

const getGeminiPrompt = (resumeText, visaType, language) => {
  let langName = "English";
  switch (language) {
    case "es":
      langName = "Spanish";
      break;
    case "hi":
      langName = "Hindi";
      break;
    case "ru":
      langName = "Russian";
      break;
  }
  return `
    Analyze the following resume text for a U.S. ${visaType} visa application.
    Based *only* on the text provided, evaluate the applicant against the 8 O-1A criteria.

    Respond in this language: ${langName}

    Provide a JSON response with this *exact* structure:
    {
      "score": <a score from 0-100 based on overall strength>,
      "summary": "<a 2-3 sentence overview of the profile's strengths and weaknesses for the ${visaType} visa.>",
      "conclusion": {
        "keySteps": [
         "<actionable step 1 (in ${langName})>",
          "<actionable step 2 (in ${langName})>",
          "<actionable step 3 (in ${langName})>"
        ],
        "focusAreas": [
          "<critical weakness 1 (in ${langName})>",
          "<critical weakness 2 (in ${langName})>"
        ]
      },
      "criteriaAnalysis": {
        "prizes": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." },
        "membership": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." },
        "contributions": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." },
        "employment": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." },
        "salary": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." },
        "media": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." },
        "articles": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." },
        "judging": { "level": "Weak|Medium|Strong", "reason": "Brief reason (in ${langName}) based *only* on the resume." }
      }
    }

    Here is the resume text:
    ---
    ${resumeText}
    ---
  `;
};

export const generateEvaluation = async ({
  fullName,
  email,
  country,
  visaType,
  resumeText,
  language,
}) => {
  try {
    const prompt = getGeminiPrompt(resumeText, visaType, language);

    console.log(`Sending prompt to Gemini (lang: ${language})...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Received response from Gemini.");

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResult = JSON.parse(text);

    const finalScore = Math.min(aiResult.score, MAX_SCORE_CAP);

    return {
      fullName,
      email,
      country,
      visaType,
      language,
      score: finalScore,
      summary: aiResult.summary,
      criteriaAnalysis: aiResult.criteriaAnalysis,
      conclusion: aiResult.conclusion,
    };
  } catch (error) {
    console.error("Evaluation service error:", error);
    // Fallback in case Gemini fails
    return {
      fullName,
      email,
      country,
      visaType,
      language,
      score: 10,
      summary: "AI analysis failed. Using placeholder data. " + error.message,
      criteriaAnalysis: {
        prizes: { level: "Weak", reason: "AI analysis failed." },
        membership: { level: "Weak", reason: "AI analysis failed." },
        contributions: { level: "Weak", reason: "AI analysis failed." },
        employment: { level: "Weak", reason: "AI analysis failed." },
        salary: { level: "Weak", reason: "AI analysis failed." },
        media: { level: "Weak", reason: "AI analysis failed." },
        articles: { level: "Weak", reason: "AI analysis failed." },
        judging: { level: "Weak", reason: "AI analysis failed." },
      },
      conclusion: {
        keySteps: ["Double-check Gemini API key and quota."],
        focusAreas: ["AI service returned an error."],
      },
    };
  }
};
