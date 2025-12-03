import { GoogleGenAI, Type } from "@google/genai";

export const generateCreativeRandom = async (prompt: string, count: number): Promise<string[]> => {
  // Use process.env.API_KEY as per guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key is missing. Please configure API_KEY in your environment.");
    return ["Error: API Key is missing. Please configure API_KEY and restart."];
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
        temperature: 1.2,
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
    console.error("AI API Error:", error);
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return ["Error: Too many requests or quota exceeded."];
    }
    if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('API key')) {
      return ["Error: Invalid API Key."];
    }
    
    return [`Error: ${error.message || "Service temporarily unavailable."}`];
  }
};