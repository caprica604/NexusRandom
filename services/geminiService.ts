import { GoogleGenAI, Type } from "@google/genai";

export const generateCreativeRandom = async (prompt: string, count: number): Promise<string[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key is missing from environment variables.");
    return ["Error: API Key is missing. Unable to contact AI service."];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a list of ${count} random ${prompt}. Be creative and diverse.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
        systemInstruction: "You are a creative random generator. You output only a strict JSON array of strings based on the user's request. Do not include markdown formatting or explanations.",
        temperature: 1.2, // High temperature for more randomness
      }
    });

    const text = response.text;
    if (!text) return ["Error: Empty response from AI service."];
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse Error:", text);
      return ["Error: Failed to parse AI response."];
    }

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
    return ["Error: AI returned unexpected format."];

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide more specific user feedback
    if (error.message?.includes('429')) {
      return ["Error: Too many requests. Please wait a moment."];
    }
    if (error.message?.includes('403') || error.message?.includes('API key')) {
      return ["Error: Invalid API Key or permission denied."];
    }
    
    return [`Error: ${error.message || "Service temporarily unavailable."}`];
  }
};