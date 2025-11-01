import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

// FIX: Use GoogleGenAI with the correct constructor { apiKey: API_KEY }
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn("API_KEY environment variable not set. Using fallback paragraph.");
}

const fallbackParagraph = "The quick brown fox jumps over the lazy dog. This sentence contains all of the letters of the English alphabet. Technology has revolutionized the way we live and work, creating new opportunities and challenges. A journey of a thousand miles begins with a single step.";

export const generateRandomParagraph = async (): Promise<string> => {
  // FIX: Check for the initialized 'ai' instance.
  if (!ai) {
    return Promise.resolve(fallbackParagraph);
  }

  try {
    // FIX: Updated to use the recommended `ai.models.generateContent` method and a current model.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        parts: [{
          text: "Generate a random, interesting paragraph of about 40-50 words suitable for a typing test. The paragraph should contain a mix of common English words, some punctuation like commas and periods, and be easy to read. Do not include any special characters or formatting."
        }]
      }],
    });
    
    // FIX: Use the `.text` accessor to get the response text.
    const text = response.text.trim();
    // Basic validation
    if (text && text.length > 50) {
      return text;
    }
    // If response is invalid, return fallback
    return fallbackParagraph;
  } catch (error) {
    console.error("Error generating paragraph with Gemini:", error);
    return fallbackParagraph;
  }
};
