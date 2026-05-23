import { StatusCodes } from "http-status-codes";
import { pool } from "../../db/index.js";
import type { IIssue, IssueStatus, IssueType, ROLES } from "../../types/index.js";
import AppError from "../../utility/AppError.js";
import { isIssueStatus, isIssueType } from "../../utility/validators.js";

type CreateIssuePayload = {
  title: string;
  description: string;
  type: IssueType;
};

type UpdateIssuePayload = Partial<CreateIssuePayload>;

type IssueQuery = {
  sort?: string;
  type?: string;
  status?: string;
};

const validateIssuePayload = (payload: CreateIssuePayload, partial = false) => {
  if (!partial || payload.title !== undefined) {
    if (!payload.title || payload.title.length > 150) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Title is required and must be maximum 150 characters");
    }
  }

  if (!partial || payload.description !== undefined) {
    if (!payload.description || payload.description.length < 20) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Description is required and must be minimum 20 characters");
    }
  }

  if (!partial || payload.type !== undefined) {
    if (!payload.type || !isIssueType(payload.type)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Type must be bug or feature_request");
    }
  }
};

const attachReporters = async (issues: IIssue[]) => {
  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];
  const reporterData = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds],
  );

  return issues.map((issue) => {
    const reporter = reporterData.rows.find((user) => user.id === issue.reporter_id);
    const { reporter_id, ...issueWithoutReporterId } = issue;

    return {
      ...issueWithoutReporterId,
      reporter: reporter || null,
    };
  });
};

const createIssueIntoDB = async (payload: CreateIssuePayload, reporterId: number) => {
  validateIssuePayload(payload);

  const reporter = await pool.query(`SELECT id FROM users WHERE id=$1`, [reporterId]);

  if (reporter.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Reporter not found");
  }

  const result = await pool.query(
    `
      INSERT INTO issues(title, description, type, reporter_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
    [payload.title, payload.description, payload.type, reporterId],
  );

  return result.rows[0] as IIssue;
};

const getAllIssuesFromDB = async (query: IssueQuery) => {
  const conditions: string[] = [];
  const values: string[] = [];

  if (query.type) {
    if (!isIssueType(query.type)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid issue type filter");
    }
    values.push(query.type);
    conditions.push(`type=$${values.length}`);
  }

  if (query.status) {
    if (!isIssueStatus(query.status)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Invalid issue status filter");
    }
    values.push(query.status);
    conditions.push(`status=$${values.length}`);
  }

  const sort = query.sort === "oldest" ? "ASC" : "DESC";
  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT * FROM issues ${whereClause} ORDER BY created_at ${sort}`,
    values,
  );

  return attachReporters(result.rows as IIssue[]);
};

const getSingleIssueFromDB = async (id: number) => {
  const issueData = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);

  if (issueData.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  const issues = await attachReporters(issueData.rows as IIssue[]);
  return issues[0];
};

const updateIssueIntoDB = async (
  id: number,
  payload: UpdateIssuePayload,
  userId: number,
  role: ROLES,
) => {
  validateIssuePayload(payload as CreateIssuePayload, true);

  const issueData = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);

  if (issueData.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  const issue = issueData.rows[0] as IIssue;

  if (role !== "maintainer") {
    if (issue.reporter_id !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "Contributors can update only their own issue");
    }

    if (issue.status !== "open") {
      throw new AppError(StatusCodes.CONFLICT, "Contributors can update only open issues");
    }
  }

  const result = await pool.query(
    `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        updated_at = NOW()
      WHERE id=$4
      RETURNING *
    `,
    [payload.title, payload.description, payload.type, id],
  );

  return result.rows[0] as IIssue;
};

const updateIssueStatusIntoDB = async (id: number, status: IssueStatus) => {
  if (!isIssueStatus(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Status must be open, in_progress, or resolved");
  }

  const result = await pool.query(
    `UPDATE issues SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, id],
  );

  if (result.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  return result.rows[0] as IIssue;
};

const deleteIssueFromDB = async (id: number) => {
  const result = await pool.query(`DELETE FROM issues WHERE id=$1 RETURNING id`, [id]);

  if (result.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Issue not found");
  }

  return null;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  updateIssueStatusIntoDB,
  deleteIssueFromDB,
};
