/*
  Initially developed to create tables etc in db
  Dockerfile should take care of this job now

  Not deleting this in case in future
*/

const { readdir, readFile } = require("fs/promises");
const path = require("path");
const { Client } = require("pg");

require("dotenv").config({ path: "../../.env" });

const pg = new Client({
  user: process.env.PGUSER,
  host: "0.0.0.0",
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || "3449"),
});

const parseSqlFile = async (file) => {
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
    console.log(`Error occured while parsing ${file}`);
    throw error;
  }
};

const CreateTables = async () => {
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
          console.log(`Error occured while executing ${query}`);
          throw error;
        }
      }

      console.log(`Tables ${file} creation completed`);
    }
  } catch (error) {
    console.log("Error occured in createtables");
    console.log(error);
  }
};

(async () => {
  // check database is up
  try {
    await pg.connect();
    console.log("Postgres is running");
  } catch (error) {
    console.log("Cannot connect to postgres");
    console.log(error);
    process.exit(1);
  }

  // create tables
  await CreateTables();

  // disconnect the client
  try {
    await pg.end();
    console.log("Postgres disconnected");
  } catch (error) {
    console.log("Cannot disconnect from postgres");
    console.log(error);
  }
})();
