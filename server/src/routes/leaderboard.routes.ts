import { Router } from "express";
import { getLeaderboard, getDashboardStats } from "../controllers/leaderboard.controller.ts";

const router = Router();

router.get("/", getLeaderboard);
router.get("/dashboard-stats", getDashboardStats);

export default router;
