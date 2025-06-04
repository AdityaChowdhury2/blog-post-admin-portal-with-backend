import httpStatus from "http-status";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config/jwt";
import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { comparePassword, hashPassword } from "../../utils/hash";
import prisma from "../../config/prisma";

const loginService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    return { token };
};

const registerService = async (email: string, password: string) => {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        throw new AppError(httpStatus.NOT_FOUND, "User already exists");
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
        data: { email, password: hashed },
    });

    return { id: user.id, email: user.email };
};

export const AuthService = {
    loginService,
    registerService,
};