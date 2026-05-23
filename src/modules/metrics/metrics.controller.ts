import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utility/catchAsync.js";
import sendResponse from "../../utility/sendResponse.js";
import { metricsService } from "./metrics.service.js";

const getMetrics = catchAsync(async (req: Request, res: Response) => {
  const result = await metricsService.getMetricsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "System metrics retrieved successfully",
    data: result,
  });
});

export const metricsController = {
  getMetrics,
};
