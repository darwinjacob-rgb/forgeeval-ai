import { Request, Response } from "express";
import prisma from "../config/database.ts";
import { sendSuccess } from "../utils/response.ts";

/**
 * Get Leaderboard & Results breakdown
 */
export async function getLeaderboard(req: Request, res: Response) {
  const { problemId, category, limit = 20 } = req.query;

  const where: any = {};
  if (problemId && typeof problemId === "string") where.problemId = problemId;
  if (category && category !== "all" && typeof category === "string") {
    where.problem = { category: category };
  }

  const submissions = await prisma.submission.findMany({
    where,
    take: Number(limit),
    orderBy: [{ overallScore: "desc" }, { createdAt: "asc" }],
    include: {
      problem: { select: { id: true, title: true, category: true, difficulty: true } },
      team: { select: { id: true, name: true } },
      _count: { select: { judgeScores: true, securityFindings: true } },
    },
  });

  const rankedSubmissions = submissions.map((sub, index) => ({
    rank: index + 1,
    ...sub,
  }));

  return sendSuccess(res, { leaderboard: rankedSubmissions });
}

/**
 * Get overall dashboard analytics & metrics
 */
export async function getDashboardStats(req: Request, res: Response) {
  const [totalProblems, totalSubmissions, totalFindings, averageScoreAgg] = await Promise.all([
    prisma.problem.count(),
    prisma.submission.count(),
    prisma.securityFinding.count(),
    prisma.submission.aggregate({
      _avg: {
        overallScore: true,
        scoreSecurity: true,
        scoreTesting: true,
        scoreCodeQuality: true,
      },
    }),
  ]);

  const recentSubmissions = await prisma.submission.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      problem: { select: { id: true, title: true, category: true } },
      team: { select: { id: true, name: true } },
    },
  });

  const avgObj = averageScoreAgg._avg || {};

  return sendSuccess(res, {
    stats: {
      totalProblems,
      totalSubmissions,
      totalFindings,
      avgScoreOverall: Math.round(avgObj.overallScore || 0),
      avgScoreAI: Math.round(avgObj.scoreCodeQuality || 0),
      avgScoreSecurity: Math.round(avgObj.scoreSecurity || 0),
      avgScoreRuntime: Math.round(avgObj.scoreTesting || 0),
    },
    recentSubmissions,
  });
}
