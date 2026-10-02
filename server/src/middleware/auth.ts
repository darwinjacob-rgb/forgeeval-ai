import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import prisma from "../config/database.js";
import { sendError } from "../utils/response.js";

export interface AuthPayload {
  userId: string;
  role: string;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Verify JWT from HTTP-only cookie and attach user to request
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.token;

    if (!token) {
      sendError(res, "UNAUTHORIZED", "Authentication required", 401);
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as AuthPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      sendError(res, "UNAUTHORIZED", "User not found", 401);
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    sendError(res, "UNAUTHORIZED", "Invalid or expired token", 401);
  }
}

/**
 * Role-based access control middleware factory
 */
export function requireRole(roles: string | string[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "UNAUTHORIZED", "Authentication required", 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, "FORBIDDEN", `Required role: ${allowedRoles.join(" or ")}`, 403);
      return;
    }

    next();
  };
}

/**
 * Optional auth — doesn't reject if no token, but populates user if present
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.token;
    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as AuthPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (user) {
      req.user = user;
    }
  } catch {
    // Token invalid — continue without user
  }
  next();
}
