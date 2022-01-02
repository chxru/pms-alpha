import { Router, Request, Response } from "express";
import { checkSchema } from "express-validator";
import multer from "multer";
import { extname } from "path";

import {
  HandleDischarge,
  HandleNewBedTicket,
  HandleNewEntry,
  HandleReadEntries,
} from "@pms-alpha/server/controllers/bedticket.controller";
import {
  close_bedticket_schema,
  new_bedticket_schemea,
  new_entry_schema,
  read_entry_schema,
} from "@pms-alpha/server/routes/schemas/bedticket.schema";

import { CreateFileName } from "@pms-alpha/server/util/nanoid";
import { ValidateRequest } from "@pms-alpha/server/util/requestvalidate";

import { logger } from "@pms-alpha/shared";

import type { API } from "@pms-alpha/types";

const storage = multer.diskStorage({
  destination: "../../uploads/",
  filename: async (_req, file, cb) => {
    try {
      const id = await CreateFileName();
      cb(null, id + extname(file.originalname));
    } catch (error) {
      logger(
        `Error occured while generating nano id for file ${file.filename}`,
        "error"
      );
      cb(null, file.originalname);
    }
  },
});

const router = Router();
const upload = multer({ storage });

// create new bed ticket
router.post(
  "/new/:id",
  checkSchema(new_bedticket_schemea),
  ValidateRequest,
  async (req: Request, res: Response<API.Response>) => {
    try {
      await HandleNewBedTicket(req.params.id);

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
  ValidateRequest,
  async (req: Request, res: Response<API.Response>) => {
    try {
      await HandleDischarge(req.params.id);

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
  ValidateRequest,
  async (req: Request, res: Response<API.Response>) => {
    try {
      await HandleNewEntry(req.params.id, req.body, req.files);

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
  ValidateRequest,
  async (req: Request, res: Response<API.Response>) => {
    try {
      const { data } = await HandleReadEntries(req.params.id);

      res.status(200).json({ success: true, data });
    } catch (error) {
      logger(`Error occured while fetching entries:${req.params.id}`, "error");
      console.log(error);
      res.sendStatus(500);
    }
  }
);

export default router;
