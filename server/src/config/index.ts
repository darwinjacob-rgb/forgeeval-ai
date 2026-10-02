import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwt: {
    secret: process.env.JWT_SECRET || "CHANGE_THIS_DEFAULT_SECRET",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "CHANGE_THIS_REFRESH_SECRET",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },
  ai: {
    provider: process.env.AI_PROVIDER || "",
    model: process.env.AI_MODEL || "",
    apiKey: process.env.AI_API_KEY || "",
  },
  isProduction: process.env.NODE_ENV === "production",
} as const;

export default config;
