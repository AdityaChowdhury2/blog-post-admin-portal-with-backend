import httpStatus from "http-status";
import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_SECRET,
} from "../../config/jwt";
import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { comparePassword, hashPassword } from "../../utils/hash";
import prisma from "../../config/prisma";
import { IAuthRegisterPayload, IAuthLoginPayload } from "./auth.interface";
import { JwtUtils } from "../../utils/jwtUtils";

const login = async (payload: IAuthLoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!(await comparePassword(payload.password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  const accessToken = JwtUtils.generateAccessToken({
    userId: user.id.toString(),
    email: user.email,
  });

  const refreshToken = JwtUtils.generateRefreshToken({
    userId: user.id.toString(),
    email: user.email,
  });

  //   Save refresh token to database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return {
    accessToken,
    refreshToken,
    email: user.email,
    role: user.role,
    id: user.id,
    name: user.name,
  };
};

const register = async (payload: IAuthRegisterPayload) => {
  const userExists = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (userExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User already exists");
  }

  const hashed = await hashPassword(payload.password);
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashed,
      name: payload.name,
      role: payload.role,
    },
  });

  return { id: user.id, email: user.email, role: user.role };
};

export const AuthService = {
  loginService: login,
  registerService: register,
};
