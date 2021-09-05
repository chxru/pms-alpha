import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";

import { new_patient_schema } from "./schemas/patient.schema";
import {
  HandleNewPatient,
  HandlePatientBasicInfo,
} from "../controllers/patient.controller";
import { logger } from "../util/logger";

const router = Router();

router.get("/:id/basic", async (req, res) => {
  const pid = req.params.id;
  logger(`/patient/${pid}/basic`);

  try {
    const { err, data } = await HandlePatientBasicInfo(pid);

    if (err) {
      res.status(400).json({ err });
      return;
    }

    res.status(200).json({ res: data });
  } catch (error) {
    logger(`Error occured while fetching patient:${pid} basic info`, "error");
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  "/add",
  checkSchema(new_patient_schema),
  async (req: Request, res: Response) => {
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
      res.status(200).json({ id });
    } catch (error) {
      logger("Error occured while saving patient info", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
