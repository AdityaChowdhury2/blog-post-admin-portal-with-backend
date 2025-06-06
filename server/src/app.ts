import express, { Application } from "express";
import cors from "cors";
import path from "path";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://book-catalog-frontend.vercel.app"
        : "http://localhost:5173", // ✅ specify exact frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", router);

const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Global Error Handler
app.use(globalErrorHandler);
app.use(notFound);

export default app;
