// src/controllers/auth.controller.ts
import { Request, RequestHandler, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const login: RequestHandler = catchAsync(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await AuthService.loginService(email, password);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Login successful",
            data: result,
        });
    }
);

const register: RequestHandler = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.registerService(email, password);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

export const AuthController = {
    login,
    register,
};