import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Function to generate a unique session ID or token
const generateSessionToken = (): string => {
  return uuidv4();
};

// Controller function for the home route
export const home = (req: Request, res: Response) => {
  if (!req.cookies || !req.cookies.sessionToken) {
    const sessionToken = generateSessionToken();

    res.cookie("sessionToken", sessionToken, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res
      .status(200)
      .json({ message: "Welcome! Cookie has been set", sessionToken });
  }

  res
    .status(200)
    .json({ message: "Welcome back!", sessionToken: req.cookies.sessionToken });
};
