import { Router } from "express";

const router = Router();

router.get("/hello", (req, res) => {
  res.send("Hello from Express");
});

export default router;
