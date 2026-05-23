import type { IssueStatus, IssueType, ROLES } from "../types/index.js";

export const roles: ROLES[] = ["contributor", "maintainer"];
export const issueTypes: IssueType[] = ["bug", "feature_request"];
export const issueStatuses: IssueStatus[] = ["open", "in_progress", "resolved"];

export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
export const isRole = (role: string): role is ROLES => roles.includes(role as ROLES);
export const isIssueType = (type: string): type is IssueType => issueTypes.includes(type as IssueType);
export const isIssueStatus = (status: string): status is IssueStatus => issueStatuses.includes(status as IssueStatus);
