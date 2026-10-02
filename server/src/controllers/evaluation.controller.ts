import { Request, Response } from "express";
import prisma from "../config/database.ts";
import { sendSuccess, AppError } from "../utils/response.ts";
import { SecurityService } from "../services/security.service.ts";
import { RuntimeService } from "../services/runtime.service.ts";
import { AIEvaluationService } from "../services/aiEvaluation.service.ts";

/**
 * Trigger dynamic re-evaluation for a submission
 */
export async function reevaluateSubmission(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { problem: true },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  // Update status to analyzing
  await prisma.submission.update({
    where: { id },
    data: { status: "ANALYZING" },
  });

  // Re-run evaluation pipeline
  const [securityRes, runtimeRes, aiRes] = await Promise.all([
    SecurityService.analyzeSubmission(submission.id, submission.repositoryUrl || undefined),
    RuntimeService.runRuntimeTests(submission.id, undefined, submission.repositoryUrl || undefined),
    AIEvaluationService.evaluateSubmission(
      submission.problem.title,
      submission.problem.description,
      [],
      submission.repositoryUrl || undefined
    ),
  ]);

  const scoreOverall = Math.round(
    aiRes.scoreAI * 0.4 + securityRes.scoreSecurity * 0.3 + runtimeRes.scoreRuntime * 0.3
  );

  // Clear existing items and update
  const updatedSubmission = await prisma.$transaction(async (tx) => {
    await tx.securityFinding.deleteMany({ where: { submissionId: id } });
    await tx.runtimeTest.deleteMany({ where: { submissionId: id } });

    if (securityRes.findings.length > 0) {
      await tx.securityFinding.createMany({
        data: securityRes.findings.map((f) => ({
          submissionId: id,
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

    if (runtimeRes.testSuiteResults.length > 0) {
      await tx.runtimeTest.createMany({
        data: runtimeRes.testSuiteResults.map((t) => ({
          submissionId: id,
          name: t.name,
          status: t.status === "PASSED" ? "PASSED" : "FAILED",
          duration: t.durationMs,
        })),
      });
    }

    return tx.submission.update({
      where: { id },
      data: {
        overallScore: scoreOverall,
        scoreSecurity: securityRes.scoreSecurity,
        scoreTesting: runtimeRes.scoreRuntime,
        scoreRequirement: aiRes.scoreRequirements,
        scoreCodeQuality: aiRes.scoreCodeQuality,
        status: "ANALYZED",
      },
      include: {
        securityFindings: true,
        runtimeTests: true,
      },
    });
  });

  return sendSuccess(
    res,
    { submission: updatedSubmission },
    "Submission evaluation completed successfully"
  );
}

/**
 * Get AI breakdown for submission
 */
export async function getAIEvaluationDetails(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      requirementResults: true,
      problem: true,
    },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  return sendSuccess(res, {
    submissionId: submission.id,
    scoreRequirements: submission.scoreRequirement,
    scoreCodeQuality: submission.scoreCodeQuality,
    requirementResults: submission.requirementResults,
  });
}

/**
 * Get security findings report
 */
export async function getSecurityReport(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      securityFindings: { orderBy: { severity: "asc" } },
    },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  return sendSuccess(res, {
    submissionId: submission.id,
    scoreSecurity: submission.scoreSecurity,
    findings: submission.securityFindings,
  });
}

/**
 * Get runtime test suite execution results
 */
export async function getRuntimeReport(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      runtimeTests: true,
    },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  return sendSuccess(res, {
    submissionId: submission.id,
    scoreRuntime: submission.scoreTesting,
    runtimeTests: submission.runtimeTests,
  });
}
