import { logger } from "../util/logger";
import pg from "./pg";

const CheckConnection = async (): Promise<void> => {
  await pg.connect();
  logger("Connected to postgres established", "success");
};

export { CheckConnection };
