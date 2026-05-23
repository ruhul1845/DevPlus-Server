import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../utility/AppError.js";

const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: process.env.NODE_ENV === "production" ? undefined : err,
  });
};

export default globalErrorHandler;
