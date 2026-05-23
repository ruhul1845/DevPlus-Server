import CookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config/index.js";
import logger from "./middleware/logger.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import notFound from "./middleware/notFound.js";
import { authRoute } from "./modules/auth/auth.route.js";
import { issueRoute } from "./modules/issues/issues.route.js";
import { metricsRoute } from "./modules/metrics/metrics.route.js";

const app: Application = express();

app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(
  cors({
    origin: config.cors_origin,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "DevPulse API Server",
    author: "Next Level",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);
app.use("/api/metrics", metricsRoute);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
