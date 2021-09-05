import db from "../database/pg";
import { DecryptData, EncryptData } from "../util/crypto";

import type { API } from "types/api";
import type { PGDB } from "types/pg";

/**
 * Return decrypted patient basic info for gived patient id
 *
 * @param {string} pid
 * @return {*}  {Promise<{ data?: PGDB.Patient.BasicDetails; err?: string }>}
 */
const HandlePatientBasicInfo = async (
  pid: string
): Promise<{ data?: PGDB.Patient.BasicDetails; err?: string }> => {
  const id = parseInt(pid);
  if (isNaN(id)) {
    return { err: "ID is not a number" };
  }

  const query = await db.query("SELECT * FROM patients.info WHERE id=$1", [id]);
  if (query.rowCount === 0) {
    return { err: "No patient found" };
  }

  const encrypted: PGDB.Patient.Encrypted = query.rows[0];
  const data = DecryptData<PGDB.Patient.BasicDetails>(encrypted.data);
  return { data };
};

/**
 * @param {API.Patient.BasicDetails} data
 * @return {*}  {Promise<number>} patient id
 */
const HandleNewPatient = async (
  data: API.Patient.BasicDetails
): Promise<number> => {
  const encrypted = EncryptData(data);

  // save data in database
  const query = await db.query(
    "INSERT INTO patients.info (data) VALUES ($1) RETURNING id",
    [encrypted]
  );

  return query.rows[0].id;
};

export { HandlePatientBasicInfo, HandleNewPatient };
