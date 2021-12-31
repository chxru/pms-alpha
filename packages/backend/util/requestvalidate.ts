import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/**
 * Validate params with schema, send 400 if validation failed
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Schema} schema
 */
const ValidateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // concat array of errors to one string
    const err = errors
      .array()
      .map((i) => `${i.param}: ${i.msg}`)
      .join("\n");

    res.status(400).json({ success: false, err });
  } else {
    next();
  }
};

export { ValidateRequest };
