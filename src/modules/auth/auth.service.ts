import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import config from "../../config/index.js";
import { pool } from "../../db/index.js";
import AppError from "../../utility/AppError.js";
import type { IUser, ROLES } from "../../types/index.js";
import { isRole, isValidEmail } from "../../utility/validators.js";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role?: ROLES;
};

type LoginPayload = {
  email: string;
  password: string;
};

const signupUserIntoDB = async (payload: SignupPayload) => {
  const { name, email, password } = payload;
  const role = payload.role || "contributor";

  if (!name || !email || !password) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Name, email and password are required");
  }

  if (!isValidEmail(email)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid email address");
  }

  if (!isRole(role)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Role must be contributor or maintainer");
  }

  const existingUser = await pool.query(`SELECT id FROM users WHERE email=$1`, [email]);

  if (existingUser.rows.length > 0) {
    throw new AppError(StatusCodes.CONFLICT, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

  const result = await pool.query(
    `
      INSERT INTO users(name, email, password, role)
      VALUES($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at, updated_at
    `,
    [name, email, hashedPassword, role],
  );

  return result.rows[0] as Omit<IUser, "password">;
};

const loginUserIntoDB = async (payload: LoginPayload) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email and password are required");
  }

  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  if (userData.rows.length === 0) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid Credentials!");
  }

  const user = userData.rows[0] as IUser & { password: string; id: number; role: ROLES };
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid Credentials!");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtpayload, config.secret, {
    expiresIn: config.jwt_expires_in,
  } as jwt.SignOptions);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
};
