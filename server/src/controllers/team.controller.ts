import { Request, Response } from "express";
import prisma from "../config/database.ts";
import { sendSuccess, AppError } from "../utils/response.ts";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FORGE-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create a new team for a hackathon
 */
export async function createTeam(req: Request, res: Response) {
  const userId = req.user?.id;
  const { name, hackathonId } = req.body;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (!name || name.trim().length < 2) {
    throw new AppError("Team name must be at least 2 characters", 400);
  }

  if (!hackathonId) {
    throw new AppError("Hackathon ID is required", 400);
  }

  // 1. Verify hackathon exists
  const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
  if (!hackathon) {
    throw new AppError("Target hackathon not found", 404);
  }

  // 2. Ensure user is registered for the hackathon
  await prisma.hackathonParticipant.upsert({
    where: {
      hackathonId_userId: { hackathonId, userId },
    },
    update: {},
    create: { hackathonId, userId },
  });

  // 3. Prevent duplicate team membership in same hackathon
  const existingMembership = await prisma.teamMember.findFirst({
    where: {
      userId,
      team: { hackathonId },
    },
    include: { team: true },
  });

  if (existingMembership) {
    throw new AppError(`You are already a member of team "${existingMembership.team.name}" for this hackathon`, 400);
  }

  // 4. Generate unique invite code
  let inviteCode = generateInviteCode();
  let codeExists = await prisma.team.findUnique({ where: { inviteCode } });
  while (codeExists) {
    inviteCode = generateInviteCode();
    codeExists = await prisma.team.findUnique({ where: { inviteCode } });
  }

  // 5. Create team and captain member
  const team = await prisma.team.create({
    data: {
      name: name.trim(),
      inviteCode,
      hackathonId,
      members: {
        create: {
          userId,
          role: "CAPTAIN",
        },
      },
    },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      },
      hackathon: { select: { id: true, name: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: "TEAM_CREATED",
      entity: "Team",
      entityId: team.id,
      metadata: { teamName: team.name, inviteCode: team.inviteCode },
    },
  });

  return sendSuccess(res, { team }, "Team created successfully", 201);
}

/**
 * Get team details by ID
 */
export async function getTeamById(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
        },
      },
      hackathon: { select: { id: true, name: true, status: true, submissionDeadline: true } },
      submissions: {
        select: {
          id: true,
          projectName: true,
          status: true,
          repositoryUrl: true,
          overallScore: true,
          isReleased: true,
          submittedAt: true,
        },
      },
    },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  return sendSuccess(res, { team });
}

/**
 * Join team using Invite Code (e.g. FORGE-7X92)
 */
export async function joinTeamByInviteCode(req: Request, res: Response) {
  const userId = req.user?.id;
  const { inviteCode } = req.body;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (!inviteCode) {
    throw new AppError("Invite code is required", 400);
  }

  const cleanCode = inviteCode.trim().toUpperCase();

  // 1. Find team by invite code
  const team = await prisma.team.findUnique({
    where: { inviteCode: cleanCode },
    include: {
      members: true,
      hackathon: true,
    },
  });

  if (!team) {
    throw new AppError("Invalid team invite code. Team not found.", 404);
  }

  // 2. Check team capacity (e.g., max 5 members)
  if (team.members.length >= 5) {
    throw new AppError("This team has already reached the maximum capacity (5 members)", 400);
  }

  // 3. Prevent joining if already member of this team
  const isAlreadyInTeam = team.members.some((m) => m.userId === userId);
  if (isAlreadyInTeam) {
    throw new AppError("You are already a member of this team", 400);
  }

  // 4. Prevent joining multiple teams in the same hackathon
  const existingMembershipInHackathon = await prisma.teamMember.findFirst({
    where: {
      userId,
      team: { hackathonId: team.hackathonId },
    },
    include: { team: true },
  });

  if (existingMembershipInHackathon) {
    throw new AppError(
      `You are already in team "${existingMembershipInHackathon.team.name}" for this hackathon. Leave your current team first.`,
      400
    );
  }

  // 5. Ensure participant is registered for the hackathon
  await prisma.hackathonParticipant.upsert({
    where: {
      hackathonId_userId: { hackathonId: team.hackathonId, userId },
    },
    update: {},
    create: { hackathonId: team.hackathonId, userId },
  });

  // 6. Add member to team
  const newMember = await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId,
      role: "MEMBER",
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: "JOINED_TEAM",
      entity: "Team",
      entityId: team.id,
      metadata: { teamName: team.name },
    },
  });

  return sendSuccess(res, { teamId: team.id, member: newMember }, `Successfully joined ${team.name}`);
}

/**
 * Leave a team
 */
export async function leaveTeam(req: Request, res: Response) {
  const userId = req.user?.id;
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: id, userId } },
    include: { team: { include: { members: true } } },
  });

  if (!membership) {
    throw new AppError("You are not a member of this team", 404);
  }

  await prisma.teamMember.delete({
    where: { teamId_userId: { teamId: id, userId } },
  });

  // If team is now empty, optionally clean up
  if (membership.team.members.length === 1) {
    await prisma.team.delete({ where: { id } }).catch(() => {});
  }

  return sendSuccess(res, null, "Successfully left team");
}

/**
 * Get current user's team for active hackathons
 */
export async function getMyTeams(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const memberships = await prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        include: {
          hackathon: { select: { id: true, name: true, status: true, submissionDeadline: true } },
          members: {
            include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
          },
          submissions: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { id: true, projectName: true, status: true, overallScore: true, isReleased: true },
          },
        },
      },
    },
  });

  return sendSuccess(res, { teams: memberships.map((m) => ({ ...m.team, myRole: m.role })) });
}
