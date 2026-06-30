const { GoogleGenAI } = require('@google/genai');
async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Evaluate this. Return JSON {"score": 5}',
      config: {
        responseMimeType: "application/json"
      }
    });
    console.log("Success:", response.text);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
