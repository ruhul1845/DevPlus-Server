import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utility/catchAsync.js";
import sendResponse from "../../utility/sendResponse.js";
import { issueService } from "./issues.service.js";

const createIssue = catchAsync(async (req: Request, res: Response) => {
  const result = await issueService.createIssueIntoDB(req.body, req.user!.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Issue created successfully",
    data: result,
  });
});

const getAllIssues = catchAsync(async (req: Request, res: Response) => {
  const result = await issueService.getAllIssuesFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: result,
  });
});

const getSingleIssue = catchAsync(async (req: Request, res: Response) => {
  const result = await issueService.getSingleIssueFromDB(Number(req.params.id));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    data: result,
  });
});

const updateIssue = catchAsync(async (req: Request, res: Response) => {
  const result = await issueService.updateIssueIntoDB(
    Number(req.params.id),
    req.body,
    req.user!.id,
    req.user!.role,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Issue updated successfully",
    data: result,
  });
});

const updateIssueStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await issueService.updateIssueStatusIntoDB(Number(req.params.id), req.body.status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Issue status updated successfully",
    data: result,
  });
});

const deleteIssue = catchAsync(async (req: Request, res: Response) => {
  await issueService.deleteIssueFromDB(Number(req.params.id));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Issue deleted successfully",
  });
});

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
};
