import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Secure Key Access
  // The API key must be obtained exclusively from process.env.API_KEY
  if (!process.env.API_KEY) {
    console.error("Server Error: API_KEY is missing.");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { prompt, count } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 3. Initialize Gemini with @google/genai
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 4. Generate Content
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of ${count || 3} items based on this request: "${prompt}". Be creative and diverse.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const text = response.text;

    if (!text) {
        return res.status(500).json({ error: 'Empty response from AI' });
    }

    // 6. Return response
    return res.status(200).json({ result: text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: error.message || 'Internal Server Error' 
    });
  }
}