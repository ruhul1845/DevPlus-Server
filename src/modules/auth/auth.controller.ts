import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utility/catchAsync.js";
import sendResponse from "../../utility/sendResponse.js";
import { authService } from "./auth.service.js";

const signupUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signupUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const authController = {
  signupUser,
  loginUser,
};
