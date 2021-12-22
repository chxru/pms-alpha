import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import {
  FetchAllDiagnosis,
  ImportDiagnosis,
  InsertDiagnosis,
} from "controllers/diagnosis.controller";
import { new_diagnosis_schema } from "./schemas/diagnosis.schema";

import { logger } from "@pms-alpha/shared";

import type { API } from "@pms-alpha/types";

const storage = multer.diskStorage({
  destination: "../../uploads/diag/",
  filename: (_req, _file, cb) => {
    cb(null, uuidv4() + ".csv");
  },
});

const router = Router();
const upload = multer({ storage });

router.get(
  "/",
  async (req: Request, res: Response<API.Response<API.Diagnosis.Data>>) => {
    try {
      const data = await FetchAllDiagnosis();
      res.status(200).json({ success: true, data });
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
  async (
    req: Request<API.Diagnosis.NewDiagnosisForm>,
    res: Response<API.Response>
  ) => {
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
      await InsertDiagnosis(req.body.name, req.body.category);
      res.status(200).json({ success: true });
    } catch (error) {
      logger("Error occured saving diagnosis type", "error");
      console.error(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/import",
  upload.single("file"),
  async (req: Request, res: Response<API.Response>) => {
    try {
      if (!req.file) throw new Error("req file is empty");

      await ImportDiagnosis(req.file.filename);
      res.status(200).json({ success: true });
    } catch (error) {
      logger("Error occured while importing diagnosis type", "error");

      console.error(error);
      res.sendStatus(500);
    }
  }
);

export default router;
