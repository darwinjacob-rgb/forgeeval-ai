import { Router } from "express";
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from "../controllers/submission.controller.ts";
import { requireAuth, optionalAuth } from "../middleware/auth.ts";

const router = Router();

router.get("/", optionalAuth, getSubmissions);
router.get("/:id", optionalAuth, getSubmissionById);
router.post("/", requireAuth, createSubmission);
router.put("/:id", requireAuth, updateSubmission);
router.delete("/:id", requireAuth, deleteSubmission);

export default router;
