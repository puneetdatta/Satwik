
import { GoogleGenAI } from "@google/genai";
import { Associate, Referral } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeReferralPerformance = async (associates: Associate[], referrals: Referral[]) => {
  const prompt = `
    Analyze the following associate referral data for Satwik Universe Private Limited.
    Associates: ${JSON.stringify(associates)}
    Referrals: ${JSON.stringify(referrals)}

    Please provide:
    1. A summary of overall performance.
    2. Identification of the top-performing associate.
    3. Three actionable tips to improve the referral model for this company.
    4. A prediction for next month's growth based on current trends.

    Respond in a professional business tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating analysis. Please check your network or API key.";
  }
};

export const getAssociateWelcomeTip = async (associateName: string) => {
  const prompt = `Provide a short, motivating welcome message and one quick tip for a new associate named ${associateName} joining Satwik Universe's referral program. Keep it under 100 words.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return `Welcome, ${associateName}! Start sharing your QR code to earn referral points today!`;
  }
};
