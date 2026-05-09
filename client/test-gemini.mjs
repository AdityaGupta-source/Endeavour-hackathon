import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyBqLKRFHscVik7NSlA6nDACuqFt5nwsTpY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log("SUCCESS!", response.text());
  } catch (error) {
    console.error("FAILED! Error:", error.message);
  }
}

test();
