import { Request, Response } from "express";
import prisma from "../config/database.ts";
import { sendSuccess, AppError } from "../utils/response.ts";

/**
 * Get all active/available hackathons
 */
export async function getHackathons(req: Request, res: Response) {
  const userId = req.user?.id;

  const hackathons = await prisma.hackathon.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: {
        select: {
          teams: true,
          problems: true,
          participants: true,
        },
      },
      participants: userId ? { where: { userId } } : false,
    },
  });

  const formatted = hackathons.map((h) => ({
    id: h.id,
    name: h.name,
    description: h.description,
    theme: h.theme,
    status: h.status,
    startDate: h.startDate,
    endDate: h.endDate,
    registrationDeadline: h.registrationDeadline,
    submissionDeadline: h.submissionDeadline,
    teamsCount: h._count.teams,
    problemsCount: h._count.problems,
    participantsCount: h._count.participants,
    isJoined: Boolean(h.participants && h.participants.length > 0),
  }));

  return sendSuccess(res, { hackathons: formatted });
}

/**
 * Get single hackathon details by ID
 */
export async function getHackathonById(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = req.user?.id;

  const hackathon = await prisma.hackathon.findUnique({
    where: { id },
    include: {
      problems: {
        include: {
          problem: {
            include: {
              _count: { select: { requirements: true, submissions: true } },
            },
          },
        },
      },
      _count: {
        select: { teams: true, participants: true },
      },
      participants: userId ? { where: { userId } } : false,
    },
  });

  if (!hackathon) {
    throw new AppError("Hackathon not found", 404);
  }

  const isJoined = Boolean(hackathon.participants && hackathon.participants.length > 0);

  return sendSuccess(res, {
    hackathon: {
      ...hackathon,
      isJoined,
      problems: hackathon.problems.map((hp) => hp.problem),
    },
  });
}

/**
 * Join / register for a hackathon
 */
export async function joinHackathon(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const hackathon = await prisma.hackathon.findUnique({ where: { id } });
  if (!hackathon) {
    throw new AppError("Hackathon not found", 404);
  }

  if (hackathon.registrationDeadline && new Date() > hackathon.registrationDeadline) {
    throw new AppError("Registration deadline for this hackathon has passed", 400);
  }

  // Upsert participant
  await prisma.hackathonParticipant.upsert({
    where: {
      hackathonId_userId: {
        hackathonId: id,
        userId,
      },
    },
    update: {},
    create: {
      hackathonId: id,
      userId,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: "JOINED_HACKATHON",
      entity: "Hackathon",
      entityId: id,
    },
  });

  return sendSuccess(res, { message: "Successfully joined hackathon", hackathonId: id }, undefined, 201);
}

/**
 * Get problems for a specific hackathon
 */
export async function getHackathonProblems(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const hackathon = await prisma.hackathon.findUnique({
    where: { id },
    include: {
      problems: {
        include: {
          problem: {
            include: {
              requirements: true,
              _count: { select: { submissions: true } },
            },
          },
        },
      },
    },
  });

  if (!hackathon) {
    throw new AppError("Hackathon not found", 404);
  }

  return sendSuccess(res, {
    problems: hackathon.problems.map((hp) => hp.problem),
  });
}
