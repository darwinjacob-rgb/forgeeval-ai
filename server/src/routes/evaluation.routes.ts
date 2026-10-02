import { Router } from "express";
import {
  reevaluateSubmission,
  getAIEvaluationDetails,
  getSecurityReport,
  getRuntimeReport,
} from "../controllers/evaluation.controller.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.post("/:id/re-evaluate", requireAuth, reevaluateSubmission);
router.get("/:id/ai-details", getAIEvaluationDetails);
router.get("/:id/security-report", getSecurityReport);
router.get("/:id/runtime-report", getRuntimeReport);

export default router;
