
import { GoogleGenAI } from "@google/genai";

export const getCountryFact = async (countryName: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide one extremely interesting, surprising, and short fact about the country: ${countryName}. Keep it under 100 characters.`,
    });
    // response.text is a property, handled correctly here
    return response.text?.trim() || "A fascinating country with a rich cultural history.";
  } catch (error) {
    console.error("Gemini fact error:", error);
    return "Explore the unique traditions and landmarks of this nation.";
  }
};
