import httpStatus from "http-status";
import { Router } from "express";
import AppError from "../../errors/AppError";
import prisma from "../../config/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Run a lightweight query to check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Health check failed");
  }
});

export const HealthRoutes = router;
