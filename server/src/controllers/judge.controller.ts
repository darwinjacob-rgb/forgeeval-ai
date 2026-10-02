import { Request, Response } from "express";
import prisma from "../config/database.ts";
import { sendSuccess, AppError } from "../utils/response.ts";
import { createJudgeEvaluationSchema } from "../validators/index.ts";

/**
 * Submit judge manual score and rubric feedback
 */
export async function submitJudgeEvaluation(req: Request, res: Response) {
  const validated = createJudgeEvaluationSchema.parse(req.body);
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  // Check submission exists
  const submission = await prisma.submission.findUnique({
    where: { id: validated.submissionId },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Upsert judge score
  const scoreRecord = await prisma.judgeScore.upsert({
    where: {
      userId_submissionId_dimension: {
        userId,
        submissionId: validated.submissionId,
        dimension: "TECHNICAL",
      },
    },
    update: {
      score: validated.scoreOverall,
      comment: validated.feedback || null,
    },
    create: {
      userId,
      submissionId: validated.submissionId,
      dimension: "TECHNICAL",
      score: validated.scoreOverall,
      comment: validated.feedback || null,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  // Update submission composite score
  const updatedSubmission = await prisma.submission.update({
    where: { id: validated.submissionId },
    data: {
      overallScore: validated.scoreOverall,
      status: "ANALYZED",
    },
  });

  return sendSuccess(
    res,
    { evaluation: scoreRecord, updatedOverallScore: updatedSubmission.overallScore },
    "Judge evaluation submitted successfully",
    201
  );
}

/**
 * Get all judge evaluations for a submission
 */
export async function getEvaluationsBySubmission(req: Request, res: Response) {
  const submissionId = Array.isArray(req.params.submissionId) ? req.params.submissionId[0] : req.params.submissionId;

  const evaluations = await prisma.judgeScore.findMany({
    where: { submissionId },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return sendSuccess(res, { evaluations });
}
