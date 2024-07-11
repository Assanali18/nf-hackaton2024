// import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';



// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { "responseMimeType": "application/json" }});
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI,
  });

async function generateFullText(data){
    const promptFullText = `Give me top 20 the best film of the history`;

  try{
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "user", content: promptFullText }
        ]
      });

    console.log(response.choices[0].message.content);

    return response.choices[0].message.content
  } catch(error){    
    console.log(error);
    return null
  }
}

export {generateFullText}