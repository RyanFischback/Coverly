import { Router } from "express";
import cookieParser from "cookie-parser";
import {
  home,
  register,
  registerValidation,
} from "../controllers/homeContoller";
import oAiRoutes from "./oAiRoutes";
import { isAuthenticated } from "../middleware/authMiddleware";
import { errorHandler } from "../middleware/errorHandler";
import { logger } from "../middleware/loggerMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";

const router = Router();

// Use middleware
router.use(cookieParser());
router.use(logger); // Log requests

// Define the home route
router.get("/", home);

// Define the register route with validation
router.post("/register", registerValidation, validateRequest, register);

// Add the OpenAI routes
router.use("/openai", oAiRoutes);

// Error handling middleware
router.use(errorHandler);

export default router;
