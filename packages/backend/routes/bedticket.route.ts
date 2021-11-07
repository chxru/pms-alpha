import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";

import {
  HandleDischarge,
  HandleNewBedTicket,
  HandleNewEntry,
  HandleReadEntries,
} from "controllers/bedticket.controller";
import {
  close_bedticket_schema,
  new_bedticket_schemea,
  new_entry_schema,
  read_entry_schema,
} from "routes/schemas/bedticket.schema";

import { logger } from "@pms-alpha/shared";

import type { API } from "@pms-alpha/types";

const storage = multer.diskStorage({
  destination: "../../uploads/",
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + extname(file.originalname));
  },
});

const router = Router();
const upload = multer({ storage });

// create new bed ticket
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

// close bed ticket
router.post(
  "/close/:id",
  checkSchema(close_bedticket_schema),
  async (req: Request, res: Response<API.Response>) => {
    logger(`/bedticket/close/${req.params.id}`);

    // schema validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // concat array of errors to one string
      const err = errors
        .array()
        .map((i) => `${i.param}: ${i.msg}`)
        .join("\n");
      logger("Patient discharge form schema validation failed", "info");
      return res.status(400).json({ success: false, err });
    }

    try {
      const { err } = await HandleDischarge(req.params.id);

      if (err) {
        res.status(400).json({ success: false, err });
        return;
      }

      logger("Ned ticket discharged");
      res.status(200).json({ success: true });
    } catch (error) {
      logger("Error occured while discharging", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

// add new entry to bed ticket
router.post(
  "/:id",
  upload.array("files"),
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
      const { err } = await HandleNewEntry(req.params.id, req.body, req.files);

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

// read entries
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
