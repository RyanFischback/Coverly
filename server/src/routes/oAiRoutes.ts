import { Router } from "express";
import { handleOpenAIRequest } from "../controllers/oAiController";

const router = Router();

// Define the route for handling OpenAI requests
router.post("/request", handleOpenAIRequest);

export default router;
