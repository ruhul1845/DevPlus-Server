import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    ...(data.message ? { message: data.message } : {}),
    ...(data.data !== undefined ? { data: data.data } : {}),
    ...(data.errors !== undefined ? { errors: data.errors } : {}),
  });
};

export default sendResponse;
