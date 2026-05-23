import { Router } from "express";
import auth from "../../middleware/auth.js";
import { metricsController } from "./metrics.controller.js";

const router = Router();

router.get("/", auth("maintainer"), metricsController.getMetrics);

export const metricsRoute = router;
