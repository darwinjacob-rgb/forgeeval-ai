import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import problemRoutes from "./problem.routes.ts";
import submissionRoutes from "./submission.routes.ts";
import evaluationRoutes from "./evaluation.routes.ts";
import judgeRoutes from "./judge.routes.ts";
import leaderboardRoutes from "./leaderboard.routes.ts";
import hackathonRoutes from "./hackathon.routes.ts";
import teamRoutes from "./team.routes.ts";
import participantRoutes from "./participant.routes.ts";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/problems", problemRoutes);
router.use("/submissions", submissionRoutes);
router.use("/evaluations", evaluationRoutes);
router.use("/judge", judgeRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/hackathons", hackathonRoutes);
router.use("/teams", teamRoutes);
router.use("/participant", participantRoutes);

export default router;
