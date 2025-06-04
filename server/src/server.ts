import { Server } from "http";
import app from "./app";
import config from "./app/config";
import prisma from "./app/config/prisma";
import * as path from "node:path";
// import * as process from "node:process";
import { generateApi } from "swagger-typescript-api";

let server: Server;

async function main() {
  try {
    await generateApi({ input: path.resolve(process.cwd(), "./swagger.json") });
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.error(error);

    // Important: exit the process with error code
    process.exit(1);
  }
}

main();

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down...`);
  try {
    await prisma.$disconnect();
    console.log("✅ Prisma disconnected");

    // ✅ Wrap server.close in a Promise so we can await it
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(1);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.on("unhandledRejection", (reason, promise) => {
  console.log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  gracefulShutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  console.log(`Uncaught Exception: ${error}`);
  gracefulShutdown("uncaughtException");
});
