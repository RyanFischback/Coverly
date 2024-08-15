import { Request, Response } from "express";
import axios from "axios";

// Ensure to load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Example function to handle requests to OpenAI API
export const handleOpenAIRequest = async (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    // Check if the OpenAI API key is available
    const apiKey = process.env.OPEN_AI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key is not configured" });
    }

    // Example OpenAI API request
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: input,
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to communicate with OpenAI API" });
  }
};
