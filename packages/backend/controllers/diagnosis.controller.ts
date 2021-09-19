import { API } from "@pms-alpha/types";
import db from "database/pg";

const FetchAllDiagnosis = async (): Promise<API.DiagnosisData[]> => {
  const fetchQuery = await db.query<API.DiagnosisData>(
    "SELECT name, category FROM pms.diagnosis"
  );

  return fetchQuery.rows;
};

const InsertDiagnosis = async (data: API.DiagnosisData): Promise<void> => {
  await db.query("INSERT INTO pms.diagnosis (name, category) VALUES ($1, $2)", [
    data.name,
    data.category,
  ]);
};

export { FetchAllDiagnosis, InsertDiagnosis };
