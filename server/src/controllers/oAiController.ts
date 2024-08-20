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
    const userContent = req.body.content;

    // Validate input
    if (!userContent) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Make the API call to OpenAI
    const request = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userContent }, // Use the user-provided content
      ],
      max_tokens: 2000,
    });

    res.json(request.choices[0].message.content);
  } catch (error) {
    console.error("Error in getOAIResult:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
