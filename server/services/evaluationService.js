export const generateEvaluation = async ({ fullName, email, country, visaType, documentPaths }) => {
  try {
    // PLACEHOLDER: Replace with actual Gemini API call
    // For now, using rule-based scoring

    const baseScore = 60
    let score = baseScore

    // Rule-based evaluation
    if (visaType.toLowerCase().includes("express entry")) score += 10
    if (visaType.toLowerCase().includes("skilled")) score += 8
    if (documentPaths?.length > 2) score += 5

    // TODO: Uncomment when adding Gemini API
    /*
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: `Evaluate this visa application: Name: ${fullName}, Country: ${country}, Visa: ${visaType}. Score 0-100.`
          }]
        }]
      },
      {
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );
    
    score = parseInt(response.data.candidates[0].content.parts[0].text) || score;
    */

    return {
      fullName,
      email,
      country,
      visaType,
      score: Math.min(score, 100),
      summary: `Application evaluated for ${visaType} visa to ${country}. Score: ${score}/100. Ready for review.`,
    }
  } catch (error) {
    console.error("Evaluation service error:", error)
    throw error
  }
}
