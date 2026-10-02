import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import problemRoutes from "./problem.routes.ts";
import submissionRoutes from "./submission.routes.ts";
import evaluationRoutes from "./evaluation.routes.ts";
import judgeRoutes from "./judge.routes.ts";
import leaderboardRoutes from "./leaderboard.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);
router.use("/submissions", submissionRoutes);
router.use("/evaluations", evaluationRoutes);
router.use("/judge", judgeRoutes);
router.use("/leaderboard", leaderboardRoutes);

export default router;
