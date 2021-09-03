import { readdir, readFile } from "fs/promises";
import path from "path";
import pg from "./pg";
import { logger } from "../util/logger";

const CheckConnection = async (): Promise<void> => {
  const client = await pg.connect();
  logger("Connected to postgres established", "success");
  client.release();
};

const parseSqlFile = async (file: string): Promise<string[]> => {
  try {
    const content = await readFile(file);
    const queries = content
      .toString()
      .replace(/\/\*.*?\*\/|--.*?\n/gs, " ") // remove comments
      .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
      .replace(/\s+/g, " ") // excess white space
      .split(";") // split into all statements
      .map((x) => x.trim())
      .filter((x) => !!x.length); // remove any empty ones
    return queries;
  } catch (error) {
    logger(`Error occured while parsing ${file}`, "error");
    throw error;
  }
};

const CreateTables = async (): Promise<void> => {
  try {
    const sqlPath = path.join(__dirname, "sql");
    let files = await readdir(sqlPath);
    files = files.filter((file) => file.endsWith("sql"));

    for (const file of files) {
      const queries = await parseSqlFile(path.join(sqlPath, file));

      for (const query of queries) {
        try {
          await pg.query(query);
        } catch (error) {
          logger(`Error occured while executing ${query}`, "error");
          throw error;
        }
      }

      logger(`Tables ${file} creation completed`, "success");
    }
  } catch (error) {
    logger("Error occured in createtables", "error");
    console.log(error);
  }
};

export { CheckConnection, CreateTables };
