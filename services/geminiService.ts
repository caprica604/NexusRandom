/**
 * Client-side service that calls the secure Vercel API route.
 * No API keys are stored here.
 */
export const generateCreativeRandom = async (prompt: string, count: number): Promise<string[]> => {
  try {
    // Call the secure backend endpoint
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, count }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 404) {
        return ["Error: API route not found. Ensure /api/gemini exists and is deployed."];
      }
      
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.result;

    if (!text) return ["Error: Empty response from AI service."];

    // Parse the JSON string returned by the AI
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
    console.error("AI Request Error:", error);
    return [`Error: ${error.message || "Service temporarily unavailable."}`];
  }
};