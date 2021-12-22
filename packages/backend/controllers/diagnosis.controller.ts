import { logger } from "@pms-alpha/shared";
import { API, PGDB } from "@pms-alpha/types";
import db from "database/pg";

import { ParseDiagnosisCSV } from "util/csv";

const FetchAllDiagnosis = async (): Promise<API.Diagnosis.Data> => {
  // fetch categories
  const q1 = await db.query<PGDB.Diagnosis.Categories>(
    "SELECT * FROM diagnosis.categories"
  );

  // fetch data
  const q2 = await db.query<PGDB.Diagnosis.Data>(
    "SELECT * FROM diagnosis.data"
  );

  return {
    categories: q1.rows,
    data: q2.rows,
  };
};

const InsertDiagnosis = async (
  name: string,
  category: number
): Promise<void> => {
  // await db.query(
  //   "INSERT INTO diagnosis.data (category, name) VALUES ($1, $2)",
  //   [category, name]
  // );

  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    // insert category
    trx.query(
      "INSERT INTO diagnosis.categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
      [category]
    );

    // insert data
    trx.query(
      "INSERT INTO diagnosis.data (name, category) VALUES ($1, (SELECT id FROM diagnosis.categories WHERE name=$2)) ON CONFLICT ON CONSTRAINT dd_cn_unique DO NOTHING",
      [name, category]
    );

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    await trx.query("ROLLBACK");

    logger("Error occured while InsertDiagnosis transaction", "error");
    throw error;
  } finally {
    trx.release();
  }
};

const ImportDiagnosis = async (filename: string): Promise<void> => {
  const { categories, records } = await ParseDiagnosisCSV(filename);

  /*
    Inserting diagnosis values seems bit tricky.
    Postgres support bulk insert but node-postgres does not support it.
    And I don't want to implement single row insertions because thats a wastage (imo).
    Therefore, I'll use a helper function to do multiple inserts in a single query
    https://github.com/brianc/node-postgres/issues/957#issuecomment-426852393

    TODO:  research pg-promise
  */

  // expand(3) returns "($1), ($2), ($3)"
  const expandCats = (rows: number) => {
    let index = 1;
    return Array(rows)
      .fill(0)
      .map(
        () =>
          `(${Array(1)
            .fill(0)
            .map(() => `$${index++}`)
            .join(", ")})`
      )
      .join(", ");
  };

  // inserting categories
  db.query(
    `INSERT INTO diagnosis.categories (name) VALUES ${expandCats(
      categories.size
    )} ON CONFLICT (name) DO NOTHING`,
    [...categories]
  );

  // expand(1) returns "($1, (SELECT id FROM diagnosis.categories WHERE name=$2) )"
  const expandData = (rows: number) => {
    let index = 1;
    return Array(rows)
      .fill(0)
      .map(
        () =>
          `(${Array(2)
            .fill(0)
            .map(() =>
              index % 2
                ? `$${index++}`
                : `(SELECT id FROM diagnosis.categories WHERE name=$${index++})`
            )
            .join(", ")})`
      )
      .join(", ");
  };

  db.query(
    `INSERT INTO diagnosis.data (name, category) VALUES ${expandData(
      records.length
    )} ON CONFLICT ON CONSTRAINT dd_cn_unique DO NOTHING`,
    [...records.flat()]
  );
};

export { FetchAllDiagnosis, InsertDiagnosis, ImportDiagnosis };
