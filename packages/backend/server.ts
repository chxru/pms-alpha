import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

import { verifyToken } from "@pms-alpha/server/middleware/authverify";

import userRoutes from "@pms-alpha/server/routes/auth.route";
import patientRoutes from "@pms-alpha/server/routes/patient.route";
import bedticketRoutes from "@pms-alpha/server/routes/bedticket.route";
import diagnosisRoutes from "@pms-alpha/server/routes/diagnosis.route";

import pg from "@pms-alpha/server/database/pg";
import { LoadDBKey } from "@pms-alpha/server/util/crypto";

import { logger } from "@pms-alpha/shared";

// dotenv
dotenv.config({ path: "../../.env" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(verifyToken);

// routes
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/bedtickets", bedticketRoutes);
app.use("/diagnosis", diagnosisRoutes);

app.use("/files", express.static(path.join(__dirname, "../../", "uploads")));

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

    // connect to database
    await pg.connect();
    logger("Connected to postgres", "success");

    // check if the first start
    const q = await pg.query<{ count: number }>(
      "SELECT COUNT(*) FROM users.data"
    );
    const fresh: boolean = q.rows[0].count == 0;

    if (fresh) {
      console.log("\n");
      console.log("Welcome to PMS-Alpha");
      console.log(
        "Login to admin portal via http://0.0.0.0:3446 to start using PMS"
      );
      console.log(
        "For more information visit https://github.com/pms-lk/pms-alpha"
      );
      console.log("\n");
    } else {
      await LoadDBKey();
      logger("Key loaded to memory", "success");
    }
  } catch (error) {
    logger("Error occured while backend starts", "error");
    console.log(error);
  }
})();
