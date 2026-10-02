import "express-async-errors";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import config from "./config/index.ts";
import routes from "./routes/index.ts";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.ts";

const app = express();

// Middleware configuration
app.use(
  cors({
    origin: [
      config.frontendUrl,
      "http://localhost:8443",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
    service: "ForgeEval API",
  });
});

// API Routes
app.use("/api/v1", routes);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
