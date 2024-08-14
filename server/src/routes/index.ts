import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid"; // To generate unique session IDs

const router = Router();

// Middleware to parse cookies
router.use(cookieParser());

// Function to generate a unique session ID or token
const generateSessionToken = (): string => {
  return uuidv4();
};

// Home page route that generates a session token
router.get("/", (req: Request, res: Response) => {
  // Check if the session cookie is already set
  if (!req.cookies || !req.cookies.sessionToken) {
    // Generate a session tokenf
    const sessionToken = generateSessionToken();

    // Set the cookie (expires in 24 hours)
    res.cookie("sessionToken", sessionToken, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true, // Accessible only by the web server
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
    });

    return res
      .status(200)
      .json({ message: "Welcome! Cookie has been set", sessionToken });
  }

  res
    .status(200)
    .json({ message: "Welcome back!", sessionToken: req.cookies.sessionToken });
});

router.post(
  "/register",
  [
    check("username")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address"),
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
  ],
  (req: Request, res: Response) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Process the validated data
    const { username, email, age, password } = req.body;

    // TODO: add database logic here

    res.status(200).json({
      message: "Registration successful",
      data: { username, email, age, password },
    });
  }
);

export default router;
