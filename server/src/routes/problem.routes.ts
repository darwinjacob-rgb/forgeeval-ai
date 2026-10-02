import { Router } from "express";
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problem.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", getProblems);
router.get("/:id", getProblemById);
router.post("/", requireAuth, requireRole(["ADMIN", "ORGANIZER"]), createProblem);
router.put("/:id", requireAuth, requireRole(["ADMIN", "ORGANIZER"]), updateProblem);
router.delete("/:id", requireAuth, requireRole(["ADMIN", "ORGANIZER"]), deleteProblem);

export default router;
