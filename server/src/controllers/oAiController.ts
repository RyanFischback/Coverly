import OpenAI from "openai";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const openai = new OpenAI({
  organization: "org-qOo3S3vv5AmPTFQe1qs4OaJz",
  project: process.env.PROJECT_ID,
});

export const getOAIResult = async (req: Request, res: Response) => {
  try {
    // Extract content from the request body
    const { jobPosting, companyDetails, userInfo, extraInfo } = req.body;

    // Validate input
    if (!jobPosting || !userInfo) {
      return res
        .status(400)
        .json({ error: "Both job posting and user information are required" });
    }

    const currentDate: Date = new Date();

    const formattedDate: string = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Combine the fields into a single message
    const combinedContent = `Please take the following job posting:\n${jobPosting}\n\n and write me a meaningful cover letter with the following candidates information:\n${userInfo}\n\n and direct it to this company if not supplied by the job posting:\n${companyDetails}\n\n and be sure to include the following additional information:\n${extraInfo}\n\n and take the month, day, and year from this date:\n${formattedDate}!`;

    if (
      !combinedContent.toLowerCase().includes("responsibilities") &&
      !combinedContent.toLowerCase().includes("requirements") &&
      !combinedContent.toLowerCase().includes("experience") &&
      !combinedContent.toLowerCase().includes("education") &&
      !combinedContent.toLowerCase().includes("skills") &&
      !combinedContent.toLowerCase().includes("qualifications")
    ) {
      return res.status(400).json({
        error: "Please enter a valid job posting and resume",
      });
    }

    // Make the API call to OpenAI
    const request = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career advisor and professional writer specializing in creating impactful cover letters. Your task is to generate a personalized and compelling cover letter based on the job description and the candidate's information provided. The cover letter should be concise (maximum of 300 words), formatted in a standard business style, and include a clear introduction, body, and conclusion. Highlight the candidate’s relevant skills, experiences, and achievements, and tailor the content to align with the job requirements and company culture. Ensure the tone is professional yet engaging. For reference, a strong cover letter starts with a brief introduction about the candidate and their interest in the role, followed by a summary of their key qualifications and experiences, and ends with a call to action or closing statement.",
        },
        { role: "user", content: combinedContent }, // Use the combined content
      ],
      max_tokens: 3000,
    });

    res.json(request.choices[0].message.content);
  } catch (error: any) {
    if (error.status === 429) {
      res.status(429).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
