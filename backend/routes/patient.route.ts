import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";

import {
  new_patient_schema,
  search_patient_schema,
} from "./schemas/patient.schema";
import {
  HandleNewPatient,
  HandlePatientBasicInfo,
  SearchPatientByName,
} from "../controllers/patient.controller";
import { logger } from "../util/logger";

import type { API } from "types/api";

const router = Router();

router.get("/:id/basic", async (req, res: Response<API.Response>) => {
  const pid = req.params.id;
  logger(`/patient/${pid}/basic`);

  try {
    const { err, data } = await HandlePatientBasicInfo(pid);

    if (err) {
      res.status(400).json({ success: false, err });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    logger(`Error occured while fetching patient:${pid} basic info`, "error");
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  "/add",
  checkSchema(new_patient_schema),
  async (req: Request, res: Response<API.Response>) => {
    logger("/patient/add");

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
      const id = await HandleNewPatient(req.body);

      logger("New patient info saved", "success");
      res.status(200).json({ success: true, data: id });
    } catch (error) {
      logger("Error occured while saving patient info", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/search",
  checkSchema(search_patient_schema),
  async (req: Request, res: Response<API.Response>) => {
    logger("/patient/search");

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
      const results = await SearchPatientByName(req.body.search);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      logger(`Error occured while searching ${req.body.search}`, "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
