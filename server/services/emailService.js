import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEvaluationEmail = async (toEmail, evaluation, lang = "en") => {
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi,</p>
        <p>Great news! Your visa evaluation report is ready. We've completed a thorough analysis of your profile and prepared detailed insights on your eligibility.</p>
        <p>Your evaluation for the <strong>${evaluation.visaType}</strong> visa includes:</p>
        <ul>
          <li>An overall score of: <strong>${evaluation.score}/100</strong></li>
          <li>A comprehensive assessment of your eligibility</li>
          <li>Personalized recommendations based on your profile</li>
          <li>Clear next steps to guide your immigration journey</li>
        </ul>
        <p><strong>AI Summary:</strong> <em>"${evaluation.summary}"</em></p>
        <p>If you have any questions or need assistance understanding your evaluation, please don't hesitate to reach out. We're here to support you throughout this process.</p>
        <p style="font-size: 0.9em; color: #777;">
          <strong>Note:</strong> ManthanSphere is a technology company that provides visa application assistance. We are not a law firm and do not provide legal advice. For legal counsel, please consult with a licensed immigration attorney.
        </p>
      </div>
    `;

  const msg = {
    to: toEmail,
    from: {
      email: "manthan.jsharma@gmail.com",
      name: "Manthan",
    },
    subject: "Your Visa Evaluation Report is Ready",
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Evaluation email sent to ${toEmail} in ${lang} via SendGrid`);
  } catch (error) {
    console.error(`Error sending email to ${toEmail} via SendGrid:`, error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
