const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
async function run() {
  try {
    const prompt = `You are a highly advanced OSINT analyst primarily operating in the context of Sri Lanka.
Perform a forensic intelligence analysis for the phone/contact number: 119.

I have no public web scraping data for this number. Rely entirely on your vast internal intelligence database to identify who owns this number (e.g., if it belongs to a major public corporation, bank, university, or government entity like the CEB, Suwaseriya, etc. in Sri Lanka).

IMPORTANT: If this is a standard mobile or landline number (not a short code) and you have no definitive internal record of it belonging to a public entity, DO NOT GUESS. You MUST return "Unknown Entity" and state that there is no public digital footprint for this personal number.

Return ONLY a JSON object with the following structure:
{
  "entity_name": "Name of the company or person (or 'Unknown Entity' if you absolutely cannot identify it)",
  "ai_summary": "A concise, professional description of the entity and their relation to the number. 1-2 sentences max.",
  "confidence": "High/Medium/Low"
}`;
    const result = await model.generateContent(prompt);
    const r = await result.response;
    console.log("Raw Response:");
    console.log(r.text());
    
    const text = r.text().trim().replace(/```json/g, '').replace(/```/g, '');
    const aiData = JSON.parse(text);
    console.log("Parsed Successfully:");
    console.log(aiData);
  } catch(e) {
    console.error('ERROR:', e);
  }
}
run();
