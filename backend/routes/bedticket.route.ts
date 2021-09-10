import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import {
  HandleNewBedTicket,
  HandleNewEntry,
  HandleReadEntries,
} from "../controllers/bedticket.controller";
import {
  new_bedticket_schemea,
  new_entry_schema,
  read_entry_schema,
} from "./schemas/bedticket.schema";

import { logger } from "../util/logger";

import type { API } from "types/api";

const router = Router();

router.post(
  "/new/:id",
  checkSchema(new_bedticket_schemea),
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

router.post(
  "/:id",
  checkSchema(new_entry_schema),
  async (req: Request, res: Response<API.Response>) => {
    logger(`/bedticket/${req.params.id}`);

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
      const { err } = await HandleNewEntry(req.params.id, req.body);

      if (err) {
        res.status(400).json({ success: false, err });
        return;
      }

      logger("New bed ticket entry added");
      res.status(200).json({ success: true });
    } catch (error) {
      logger("Error occured while saving new bed ticket entry", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/:id",
  checkSchema(read_entry_schema),
  async (req: Request, res: Response<API.Response>) => {
    logger(`/bedticket/${req.params.id} GET`);

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
      const { data, err } = await HandleReadEntries(req.params.id);

      if (err) {
        res.status(400).json({ success: false, err });
        return;
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger(`Error occured while fetching entries:${req.params.id}`, "error");
      console.log(error);
      res.sendStatus(500);
    }
  }
);

export default router;
