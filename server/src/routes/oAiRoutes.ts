import { Router } from "express";
import { getOAIResult } from "../controllers/oAiController";

const router = Router();

// Define the route for handling OpenAI requests
router.post("/fetch", getOAIResult);

export default router;
