import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
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

// Controller function for the register route
export const register = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, age, password } = req.body;

  // TODO: add database logic here

  res.status(200).json({
    message: "Registration successful",
    data: { username, email, age, password },
  });
};

// Validation middleware for the register route
export const registerValidation = [
  check("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  check("email").isEmail().withMessage("Please provide a valid email address"),
  check("age")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Age must be a positive integer"),
  check("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("confirmPassword")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
