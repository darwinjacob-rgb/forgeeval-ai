import { Request, Response } from "express";
import prisma from "../config/database.ts";
import { sendSuccess, AppError } from "../utils/response.ts";
import { createSubmissionSchema } from "../validators/index.ts";
import { SecurityService } from "../services/security.service.ts";
import { RuntimeService } from "../services/runtime.service.ts";
import { AIEvaluationService } from "../services/aiEvaluation.service.ts";

/**
 * Get all submissions with filtering, sorting, and pagination
 */
export async function getSubmissions(req: Request, res: Response) {
  const { problemId, status, search, page = 1, limit = 10, sortBy = "createdAt" } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {};
  if (problemId && typeof problemId === "string") where.problemId = problemId;
  if (status && status !== "all" && typeof status === "string") where.status = status as any;

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "scoreOverall") orderBy = { overallScore: "desc" };

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        problem: { select: { id: true, title: true, category: true } },
        team: { select: { id: true, name: true } },
        _count: { select: { securityFindings: true, runtimeTests: true, judgeScores: true } },
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return sendSuccess(res, {
    submissions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / take),
    },
  });
}

/**
 * Get single submission details by ID
 */
export async function getSubmissionById(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      problem: true,
      team: { include: { members: { include: { user: true } } } },
      securityFindings: { orderBy: { createdAt: "desc" } },
      runtimeTests: true,
      judgeScores: { include: { user: { select: { id: true, name: true, email: true } } } },
      requirementResults: { include: { requirement: true } },
    },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  return sendSuccess(res, { submission });
}

/**
 * Create a new submission & trigger evaluation pipeline
 */
export async function createSubmission(req: Request, res: Response) {
  const validated = createSubmissionSchema.parse(req.body);

  // Verify problem exists
  const problem = await prisma.problem.findUnique({
    where: { id: validated.problemId },
    include: { requirements: true },
  });

  if (!problem) {
    throw new AppError("Target problem statement not found", 404);
  }

  // Find or create default team
  let team = await prisma.team.findFirst();
  if (!team) {
    const hackathon = await prisma.hackathon.create({
      data: {
        name: "ForgeEval Master Hackathon 2026",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    });
    team = await prisma.team.create({
      data: {
        name: "CyberPulse Team",
        hackathonId: hackathon.id,
      },
    });
  }

  // 1. Create initial submission in DB
  const submission = await prisma.submission.create({
    data: {
      teamId: team.id,
      problemId: validated.problemId,
      repositoryUrl: validated.repositoryUrl,
      branch: validated.branch || "main",
      status: "ANALYZING",
    },
  });

  // 2. Run automated analysis engines
  try {
    const [securityRes, runtimeRes, aiRes] = await Promise.all([
      SecurityService.analyzeSubmission(submission.id, validated.repositoryUrl),
      RuntimeService.runRuntimeTests(submission.id, undefined, validated.repositoryUrl),
      AIEvaluationService.evaluateSubmission(
        problem.title,
        problem.description,
        problem.requirements,
        validated.repositoryUrl
      ),
    ]);

    const scoreOverall = Math.round(
      aiRes.scoreAI * 0.4 + securityRes.scoreSecurity * 0.3 + runtimeRes.scoreRuntime * 0.3
    );

    // Update submission with evaluation results
    const updatedSubmission = await prisma.$transaction(async (tx) => {
      // Create security findings
      if (securityRes.findings.length > 0) {
        await tx.securityFinding.createMany({
          data: securityRes.findings.map((f) => ({
            submissionId: submission.id,
            title: f.title,
            severity: f.severity === "CRITICAL" ? "CRITICAL" : f.severity === "HIGH" ? "HIGH" : f.severity === "MEDIUM" ? "MEDIUM" : "LOW",
            category: "SECURITY",
            filePath: f.location,
            description: f.description,
            recommendation: f.recommendation,
            status: "OPEN",
          })),
        });
      }

      // Create runtime test results
      if (runtimeRes.testSuiteResults.length > 0) {
        await tx.runtimeTest.createMany({
          data: runtimeRes.testSuiteResults.map((t) => ({
            submissionId: submission.id,
            name: t.name,
            status: t.status === "PASSED" ? "PASSED" : "FAILED",
            duration: t.durationMs,
          })),
        });
      }

      // Update main submission scores & status
      return tx.submission.update({
        where: { id: submission.id },
        data: {
          overallScore: scoreOverall,
          scoreSecurity: securityRes.scoreSecurity,
          scoreTesting: runtimeRes.scoreRuntime,
          scoreRequirement: aiRes.scoreRequirements,
          scoreCodeQuality: aiRes.scoreCodeQuality,
          status: "ANALYZED",
        },
        include: {
          problem: true,
          securityFindings: true,
          runtimeTests: true,
        },
      });
    });

    return sendSuccess(
      res,
      { submission: updatedSubmission },
      "Submission created and analyzed successfully",
      201
    );
  } catch (error) {
    // Fallback if analysis engine throws error
    const fallbackSub = await prisma.submission.update({
      where: { id: submission.id },
      data: { status: "PENDING" },
    });

    return sendSuccess(
      res,
      { submission: fallbackSub },
      "Submission received and queued for evaluation",
      201
    );
  }
}

/**
 * Update submission info
 */
export async function updateSubmission(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const existing = await prisma.submission.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Submission not found", 404);
  }

  const updated = await prisma.submission.update({
    where: { id },
    data: req.body,
  });

  return sendSuccess(res, { submission: updated }, "Submission updated successfully");
}

/**
 * Delete submission
 */
export async function deleteSubmission(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const existing = await prisma.submission.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Submission not found", 404);
  }

  await prisma.submission.delete({ where: { id } });

  return sendSuccess(res, null, "Submission deleted successfully");
}
