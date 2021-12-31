import express from "express";
import { VerifyJWT } from "util/jwt";

import { logger } from "@pms-alpha/shared";

const verifyToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void | express.Response => {
  // skip token verification for /users
  // TODO: static file bypass is temporary
  if (req.path.startsWith("/users") || req.path.startsWith("/files")) {
    next();
    return;
  }

  const token = req.headers["authorization"];

  // TODO: Remove this?
  if (process.env.PRODUCTION == "false" && token === "POSTMAN") {
    logger("POSTMAN Request", "info");
    next();
    return;
  }

  if (!token) {
    logger(`Token is missing for request ${req.path}`);
    return res.sendStatus(403);
  }

  if (VerifyJWT(token)) {
    next();
  } else {
    return res.sendStatus(403);
  }
};

export { verifyToken };
