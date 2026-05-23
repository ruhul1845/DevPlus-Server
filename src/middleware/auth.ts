import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../config/index.js";
import { pool } from "../db/index.js";
import type { AuthUser, ROLES } from "../types/index.js";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized access!!",
        });
        return;
      }

      const decoded = jwt.verify(token, config.secret) as AuthUser;

      const userData = await pool.query(
        `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id=$1`,
        [decoded.id],
      );

      if (userData.rows.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found!",
        });
        return;
      }

      const user = userData.rows[0] as AuthUser;

      if (roles.length && !roles.includes(user.role)) {
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Forbidden!!, This role has no access!",
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Missing, expired, or invalid JWT token",
        errors: error,
      });
    }
  };
};

export default auth;
