import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    throw new AppError(httpStatus.UNAUTHORIZED, "No token provided");

  const token = authHeader.split(" ")[1];
  console.log("token ====>", token);
  try {
    const decoded = jwt.verify(token, config.jwt_access_secret);
    (req as any).user = decoded;
    console.log("decoded ====>", decoded);
    next();
  } catch (err) {
    console.log("err ====>", err);
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
};
