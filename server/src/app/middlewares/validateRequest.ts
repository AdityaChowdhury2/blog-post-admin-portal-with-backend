import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // validate the request
    // if valid, pass the request to the next function
    await schema.parseAsync({
      body: req.body,
    });
    next();
  });
};
