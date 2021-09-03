import { Router, Request, Response } from "express";
import { checkSchema, validationResult } from "express-validator";

import { new_patient_schema } from "./schemas/patient.schema";
import { HandleNewPatient } from "../controllers/patient.controller";
import { logger } from "../util/logger";

const router = Router();

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
      logger("Login schema validation failed", "info");
      return res.status(400).json({ success: false, err });
    }

    try {
      await HandleNewPatient(req.body);

      logger("New patient info saved", "success");
      res.sendStatus(200);
    } catch (error) {
      logger("Error occured while saving patient info", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
