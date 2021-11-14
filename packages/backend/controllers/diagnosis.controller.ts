import { API, PGDB } from "@pms-alpha/types";
import db from "database/pg";

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
  await db.query(
    "INSERT INTO diagnosis.data (category, name) VALUES ($1, $2)",
    [category, name]
  );
};

export { FetchAllDiagnosis, InsertDiagnosis };
