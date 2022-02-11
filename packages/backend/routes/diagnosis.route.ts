import { Request, Response, Router } from "express";
import { checkSchema } from "express-validator";
import multer from "multer";
import { extname } from "path";

import {
  FetchAllDiagnosis,
  ImportDiagnosis,
  InsertDiagnosis,
} from "@pms-alpha/server/controllers/diagnosis.controller";
import { new_diagnosis_schema } from "./schemas/diagnosis.schema";

import { CreateFileName } from "@pms-alpha/server/util/nanoid";
import { ValidateRequest } from "@pms-alpha/server/util/requestvalidate";

import { logger } from "@pms-alpha/shared";

import type { API } from "@pms-alpha/types";

const storage = multer.diskStorage({
  destination: "../../uploads/diag/",
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

router.get(
  "/",
  async (req: Request, res: Response<API.Response<API.Diagnosis.Data[]>>) => {
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
  ValidateRequest,
  async (req: Request, res: Response<API.Response>) => {
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
