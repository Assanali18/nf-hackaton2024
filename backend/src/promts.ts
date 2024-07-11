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

Imagine that you are a recruiter in an IT incubator, you need to carefully select so that only those who are worthy and who are not go to the next stage. Below I will describe by what criteria it is necessary to evaluate
    Objective: To evaluate the candidate's submitted data in order to decide whether he should proceed to the next stage.Evaluate the big picture. Next, I'll tell you what criteria you can rely on

Criteria and priorities for evaluation:

IT Background (30%): Evaluate based on programming skills and more on past projects, and work experience.
Motivation (40%): Assess the detailed description of programming experience, impressive achievements and if he is self-taught or courses it is plus for motivation.
Activity and Openness (15%): review impressive achievements on different areas .
Education (15%): Consider the school/university by rating of organization and specialization.
Sample Data:

Telegram profile(doesnt matter)
Social media links(doesnt matter)
GitHub link(check if they have any projects there)
School/University attended(consider the rating of the organization)
Specialization in university
Work experience(if he is a student or a school student, work experience does not matter)
Detailed description of programming experience
Past programming projects
Impressive achievements (programming, education, sports, etc.)
Availability in Almaty (June 5 - August 9, 2024)(If they are not available, they should not proceed and immediately get a No decision without further evaluation)


Desired Output:
For each candidate, return:
Example Format:
Decision (Yes/No/Uncertain)
Score (Percentage)
Reasoning for the decision
Decision	Score	Reasoning
Yes if	more than 80%	Strong IT background, highly motivated, impressive achievements.
No if	less than 50%	Limited IT experience, unclear motivation, and no confirmation of being in Almaty, a lot of empty or meaningless fields.
Uncertain	between (50%-80%)	Good IT skills, but motivation and availability are unclear. Flagged for mentor review.

also give detailed reasoning for each field and procent of each field. 



The nFactorial Incubator is suitable for:

Students, university graduates, and beginner programmers.
High school students over 16 with basic programming knowledge.
Graduates of nFactorial Web and nFactorial Web Intro.
The program helps participants create a unique application to use as a portfolio for internships or jobs at top tech companies and for university applications. Technical requirements include a solid foundation in programming or knowledge equivalent to graduates of nFactorial Start or Web.

Please evaluate the following candidates for an IT incubator  based on their provided data.
Assess each candidate according to the specified criteria.
Return only a decision of 'Yes', 'No', or 'Uncertain' along with the score and reasoning for your decision. 
The evaluation should ensure candidates have a strong IT background, are motivated, active, open, and available in Almaty during 
the incubator period.

Example of evaluated candidate:


Input:
${data}

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