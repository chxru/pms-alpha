import { Pool } from "pg";
import { logger } from "../util/logger";

const pg = new Pool({
  user: process.env.PGUSER,
  host: "0.0.0.0",
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "3449"),
});

// pg events
pg.on("connect", () => {
  logger("pg connection initiated");
});

export default pg;
