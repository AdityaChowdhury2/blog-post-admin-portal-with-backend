import jwt from "jsonwebtoken";
import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from "../config/jwt";
import type { StringValue } from "ms";

const generateAccessToken = (user: { userId: string; email: string }) => {
  return jwt.sign(user, JWT_SECRET as string, {
    expiresIn: JWT_EXPIRES_IN as StringValue,
  });
};
const generateRefreshToken = (user: { userId: string; email: string }) => {
  return jwt.sign(user, JWT_REFRESH_SECRET as string, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as StringValue,
  });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET as string);
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET as string);
};

export const JwtUtils = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
