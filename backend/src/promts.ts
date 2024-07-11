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
  const promptFullText = `
  Imagine that you are a recruiter in an IT incubator. You need to carefully select candidates so that only those who are worthy proceed to the next stage. Evaluate the candidate's submitted data based on the following criteria:

  Criteria and priorities for evaluation:
  - IT Background (30%): Evaluate based on programming skills, past projects, and work experience.
  - Motivation (40%): Assess the detailed description of programming experience, impressive achievements, and self-taught or course-based learning.
  - Activity and Openness (15%): Review impressive achievements in different areas.
  - Education (15%): Consider the school/university and specialization.
  - Availability in Almaty (June 5 - August 9, 2024): If they are not available, immediately decide "No" without further evaluation.

  Please return a JSON object with the following keys:
  - "decision": "Yes", "No", or "Uncertain"
  - "reason": Detailed reasoning for the decision

  Evaluate the following candidate based on their provided data:

  ${JSON.stringify(data)}
  `;

  try{
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "user", content: promptFullText}
        ],
      });

    return extractJsonFromText(response.choices[0].message.content)
  } catch(error){    
    console.log(error);
    return null
  }
}

function extractJsonFromText(text) {
  const jsonRegex = /{(?:[^{}]|(R))*}/; 
  const match = text.match(jsonRegex);

  if (match) {
    try {
      const jsonObject = JSON.parse(match[0]);
      return jsonObject;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  } else {
    console.error('No JSON object found in the text.');
    return null;
  }
}

export { extractJsonFromText };


export {generateFullText}