import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import {
  FetchAllDiagnosis,
  InsertDiagnosis,
} from "controllers/diagnosis.controller";
import { new_diagnosis_schema } from "./schemas/diagnosis.schema";

import { logger } from "@pms-alpha/common/util/logger";

import type { API } from "@pms-alpha/types";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response<API.Response<API.DiagnosisData[]>>) => {
    logger("GET diagnisis/");

    try {
      const arr = await FetchAllDiagnosis();
      res.status(200).json({ success: true, data: arr });
    } catch (error) {
      logger("Error occured fetching all diagnosis types", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/",
  checkSchema(new_diagnosis_schema),
  async (req: Request<API.DiagnosisData>, res: Response<API.Response>) => {
    logger("POST diagnisis/");

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
      await InsertDiagnosis({
        name: req.body.name,
        category: req.body.category,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      logger("Error occured saving diagnosis type", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
