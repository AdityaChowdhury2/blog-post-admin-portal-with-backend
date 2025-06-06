import { UserRole } from "@prisma/client";
import { z } from "zod";

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    role: z.enum(Object.values(UserRole) as [string, ...string[]]),
  }),
});

export const AuthValidation = {
  loginSchema,
  registerSchema,
};
