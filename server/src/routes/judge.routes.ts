import { Router } from "express";
import {
  submitJudgeEvaluation,
  getEvaluationsBySubmission,
} from "../controllers/judge.controller.ts";
import { requireAuth, requireRole } from "../middleware/auth.ts";

const router = Router();

router.post("/evaluate", requireAuth, requireRole(["JUDGE", "ADMIN", "ORGANIZER"]), submitJudgeEvaluation);
router.get("/submission/:submissionId", getEvaluationsBySubmission);

export default router;
