import { GoogleGenAI } from "@google/genai";

// This file centralizes all interactions with the Gemini API.
// هذا الملف يركز جميع التفاعلات مع Gemini API.

// Ensure API_KEY is available in the environment variables.
// تأكد من توفر مفتاح الواجهة البرمجية في متغيرات البيئة.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to convert a File object to a GenerativePart
// دالة مساعدة لتحويل كائن ملف إلى جزء توليدي
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

/**
 * Generates content using the Gemini API.
 * @param {string} prompt - The text prompt for the AI.
 * @param {File | undefined} file - An optional file (image, etc.) to include.
 * @returns {Promise<string>} The AI-generated text.
 */
export const generateContent = async (prompt: string, file?: File): Promise<string> => {
  try {
    const model = file ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
    
    // FIX: The original implementation caused a TypeScript error because the `parts`
    // array was inferred to only contain text parts. This implementation constructs
    // the array dynamically, allowing TypeScript to correctly infer a union type for
    // elements that can be either image or text parts.
    const parts = [];
    if (file) {
      const imagePart = await fileToGenerativePart(file);
      parts.push(imagePart); // Add image before text
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.";
  }
};