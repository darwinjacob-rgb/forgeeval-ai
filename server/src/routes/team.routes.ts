import { Router } from "express";
import {
  createTeam,
  getTeamById,
  joinTeamByInviteCode,
  leaveTeam,
  getMyTeams,
} from "../controllers/team.controller.ts";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.post("/", requireAuth, createTeam);
router.post("/join", requireAuth, joinTeamByInviteCode);
router.get("/my-teams", requireAuth, getMyTeams);
router.get("/:id", requireAuth, getTeamById);
router.post("/:id/leave", requireAuth, leaveTeam);

export default router;
