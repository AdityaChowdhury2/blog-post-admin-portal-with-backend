// src/controllers/auth.controller.ts
import { Request, RequestHandler, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import { IAuthLoginPayload, IAuthRegisterPayload } from "./auth.interface";

const login: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const loginPayload = req.body as IAuthLoginPayload;
    const result = await AuthService.loginService(loginPayload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: {
          email: result.email,
          role: result.role,
          id: result.id,
          name: result.name,
        },
      },
      cookies: [
        {
          name: "refreshToken",
          value: result.refreshToken,
          options: {
            httpOnly: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7,
          },
        },
      ],
    });
  }
);

const register: RequestHandler = catchAsync(async (req, res) => {
  const registerPayload = req.body as IAuthRegisterPayload;
  const result = await AuthService.registerService(registerPayload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const logout: RequestHandler = catchAsync(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  console.log("refreshToken ====>", refreshToken);
  console.log("req.cookies ====>", req.cookies);
  await AuthService.logoutService(refreshToken);
  res.clearCookie("refreshToken", {
    httpOnly: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logout successful",
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  const result = await AuthService.refreshTokenService(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token successful",
    data: result,
  });
});

export const AuthController = {
  login,
  register,
  logout,
  refreshToken,
};
