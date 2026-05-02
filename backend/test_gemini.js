const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBKQPdoNhZ54CjVIxR07NFUFlxjOkX9Nqs');
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function test() {
  try {
    const prompt = "Say hello";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('Success:', response.text());
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
