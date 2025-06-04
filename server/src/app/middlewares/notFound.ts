import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const message = "Api Not Found";
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message,
  });
};

export default notFound;
