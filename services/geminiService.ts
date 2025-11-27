import { GoogleGenAI, Type } from "@google/genai";

export const generateCreativeRandom = async (prompt: string, count: number, overriddenApiKey?: string): Promise<string[]> => {
  // 1. Determine API Key
  // Priority: Manual Input > Environment Variable
  let apiKey = overriddenApiKey;
  
  if (!apiKey && typeof process !== 'undefined' && process.env) {
    apiKey = process.env.API_KEY;
  }

  if (!apiKey) {
    console.warn("API Key is missing.");
    return ["Error: API Key is missing. Please connect or enter a valid Key."];
  }

  // 2. Check Provider based on Key format
  const isOpenAI = apiKey.startsWith('sk-');

  try {
    if (isOpenAI) {
      // --- OPENAI IMPLEMENTATION ---
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Cost effective, supports JSON
          messages: [
            { 
              role: "system", 
              content: "You are a creative random generator. You output only a strict JSON array of strings based on the user's request." 
            },
            { 
              role: "user", 
              content: `Generate a list of ${count} random ${prompt}. Be creative.` 
            }
          ],
          response_format: { type: "json_object" },
          temperature: 1.1
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`OpenAI Error: ${errData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) return ["Error: Empty response from OpenAI."];

      // Parse JSON output
      // OpenAI 'json_object' usually returns { "someKey": [...] } or just the structure requested
      // We'll try to find the array in the object or parse directly
      try {
        const parsed = JSON.parse(content);
        // If it's an array directly
        if (Array.isArray(parsed)) return parsed.map(String);
        // If it's wrapped in an object { "list": [...] }
        const values = Object.values(parsed);
        if (values.length > 0 && Array.isArray(values[0])) {
           return (values[0] as any[]).map(String);
        }
        return ["Error: AI returned unexpected JSON structure."];
      } catch (e) {
        return ["Error: Failed to parse OpenAI JSON."];
      }

    } else {
      // --- GEMINI IMPLEMENTATION ---
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
    }

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