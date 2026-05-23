import type { JwtPayload } from "jsonwebtoken";

export type ROLES = "contributor" | "maintainer";
export type IssueType = "bug" | "feature_request";
export type IssueStatus = "open" | "in_progress" | "resolved";

export interface AuthUser extends JwtPayload {
  id: number;
  name: string;
  role: ROLES;
  email?: string;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: ROLES;
  created_at?: Date;
  updated_at?: Date;
}

export interface IIssue {
  id?: number;
  title: string;
  description: string;
  type: IssueType;
  status?: IssueStatus;
  reporter_id: number;
  created_at?: Date;
  updated_at?: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
