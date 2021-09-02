import express from "express";
import dotenv from "dotenv";

import * as pgverify from "./database/boot";
import { logger } from "./util/logger";

// dotenv
dotenv.config({ path: "../.env" });

const app = express();

app.all("/", (_req, res) => {
  console.log("hello from server");
  res.sendStatus(200);
});

const PORT = 3448;
(async () => {
  try {
    // mount backend
    await app.listen(PORT);
    logger(`Backend listening on port ${PORT}`, "success");

    // check database is up
    await pgverify.CheckConnection();
  } catch (error) {
    logger("Error occured while backend starts", "error");
    console.log(error);
  }
})();
