import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { HandleNewBedTicket } from "../controllers/bedticket.controller";
import { new_bedticket_schmea } from "./schemas/bedticket.schema";

import { logger } from "../util/logger";

import type { API } from "types/api";

const router = Router();

router.post(
  "/new/:id",
  checkSchema(new_bedticket_schmea),
  async (req: Request, res: Response<API.Response>) => {
    logger(`/bedticket/new/${req.params.id}`);

    // schema validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // concat array of errors to one string
      const err = errors
        .array()
        .map((i) => `${i.param}: ${i.msg}`)
        .join("\n");
      logger("New patient form schema validation failed", "info");
      return res.status(400).json({ success: false, err });
    }

    try {
      const { err } = await HandleNewBedTicket(req.params.id);

      if (err) {
        res.status(400).json({ success: false, err });
        return;
      }

      logger("New bed ticket added");
      res.status(200).json({ success: true });
    } catch (error) {
      logger("Error occured while saving new bed ticket", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
