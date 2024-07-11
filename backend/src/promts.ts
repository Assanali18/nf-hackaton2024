import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { "responseMimeType": "application/json" }});

async function generateFullText(data){
    const promptFullText = `Give me top 20 the best film of the history`;

  try{


    const promptResult = await model.generateContent(promptFullText);
    const text = promptResult.response.text();
    
    const jsonResult = JSON.parse(text);

    return jsonResult
  } catch(error){    
    console.log(error);
    return null
  }
}

export {generateFullText}