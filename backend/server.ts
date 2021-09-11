import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import userRoutes from "./routes/auth.route";
import patientRoutes from "./routes/patient.route";
import bedticketRoutes from "./routes/bedticket.route";

import * as pgverify from "./database/boot";
import { logger } from "./util/logger";

import swaggerDoc from "./swagger.json";

// dotenv
dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/bedtickets", bedticketRoutes);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

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

    // create tables
    await pgverify.CreateTables();
  } catch (error) {
    logger("Error occured while backend starts", "error");
    console.log(error);
  }
})();
