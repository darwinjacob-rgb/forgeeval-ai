import { Router } from "express";
import {
  getHackathons,
  getHackathonById,
  joinHackathon,
  getHackathonProblems,
} from "../controllers/hackathon.controller.ts";
import { requireAuth, optionalAuth } from "../middleware/auth.ts";

const router = Router();

router.get("/", optionalAuth, getHackathons);
router.get("/:id", optionalAuth, getHackathonById);
router.post("/:id/join", requireAuth, joinHackathon);
router.get("/:id/problems", optionalAuth, getHackathonProblems);

export default router;
