import { Request, Response, NextFunction } from "express";
import { sendError, AppError } from "../utils/response.js";

/**
 * Centralized error handler — catches all unhandled errors
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err instanceof AppError) {
    sendError(res, err.code, err.message, err.statusCode);
    return;
  }

  // Prisma known errors
  if ((err as any).code === "P2002") {
    sendError(res, "DUPLICATE_ENTRY", "A record with this value already exists", 409);
    return;
  }

  if ((err as any).code === "P2025") {
    sendError(res, "NOT_FOUND", "Record not found", 404);
    return;
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    const zodErr = err as any;
    const message = zodErr.errors?.map((e: any) => `${e.path.join(".")}: ${e.message}`).join("; ") || "Validation error";
    sendError(res, "VALIDATION_ERROR", message, 400);
    return;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    sendError(res, "UNAUTHORIZED", "Invalid or expired token", 401);
    return;
  }

  // Fallback
  sendError(
    res,
    "INTERNAL_ERROR",
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    500
  );
}

/**
 * 404 catch-all
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, "NOT_FOUND", `Route ${req.method} ${req.path} not found`, 404);
}
