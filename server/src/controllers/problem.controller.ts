import { Request, Response } from "express";
import prisma from "../config/database.ts";
import { sendSuccess, AppError } from "../utils/response.ts";
import { createProblemSchema, updateProblemSchema } from "../validators/index.ts";

/**
 * Get all problem statements with filtering and pagination
 */
export async function getProblems(req: Request, res: Response) {
  const { category, difficulty, search, status, page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {};
  if (category && category !== "all") where.category = category as string;
  if (difficulty && difficulty !== "all") where.difficulty = difficulty as any;
  if (status) where.status = status as any;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
      { code: { contains: search as string, mode: "insensitive" } },
    ];
  }

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { submissions: true } },
      },
    }),
    prisma.problem.count({ where }),
  ]);

  return sendSuccess(res, {
    problems,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / take),
    },
  });
}

/**
 * Get single problem statement by ID
 */
export async function getProblemById(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const problem = await prisma.problem.findUnique({
    where: { id },
    include: {
      requirements: true,
      submissions: {
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          overallScore: true,
          submittedAt: true,
        },
      },
      _count: { select: { submissions: true } },
    },
  });

  if (!problem) {
    throw new AppError("Problem statement not found", 404);
  }

  return sendSuccess(res, { problem });
}

/**
 * Create a new problem statement (Admin / Organizer)
 */
export async function createProblem(req: Request, res: Response) {
  const validated = createProblemSchema.parse(req.body);

  const problem = await prisma.problem.create({
    data: {
      code: `PROB-${Math.floor(100 + Math.random() * 900)}`,
      title: validated.title,
      description: validated.description,
      category: validated.category,
      difficulty: validated.difficulty as any,
    },
  });

  return sendSuccess(res, { problem }, "Problem statement created successfully", 201);
}

/**
 * Update existing problem statement
 */
export async function updateProblem(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const validated = updateProblemSchema.parse(req.body);

  const existing = await prisma.problem.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Problem statement not found", 404);
  }

  const problem = await prisma.problem.update({
    where: { id },
    data: validated as any,
  });

  return sendSuccess(res, { problem }, "Problem statement updated successfully");
}

/**
 * Delete a problem statement
 */
export async function deleteProblem(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const existing = await prisma.problem.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Problem statement not found", 404);
  }

  await prisma.problem.delete({ where: { id } });

  return sendSuccess(res, null, "Problem statement deleted successfully");
}
