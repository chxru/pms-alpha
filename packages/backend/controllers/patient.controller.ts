import db from "database/pg";
import { DecryptData, EncryptData } from "util/crypto";

import { logger } from "@pms-alpha/shared";

import type { API } from "@pms-alpha/types";
import type { PGDB } from "@pms-alpha/types";

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
  data: API.Patient.RegistrationForm
): Promise<number> => {
  const encrypted = EncryptData(JSON.stringify(data));
  const fullname = data.fname + " " + data.lname;

  const q = await db.query<{ id: number }>(
    "INSERT INTO patients.info (data, full_name) VALUES ($1, $2) RETURNING id",
    [encrypted, fullname]
  );

  logger(`New patient ${fullname} registered`, "success");

  return q.rows[0].id;
};

const SearchPatientByName = async (
  content: string
): Promise<API.Patient.SearchDetails[]> => {
  if (!content) {
    return [];
  }

  // https://niallburkley.com/blog/index-columns-for-like-in-postgres/
  const query = await db.query(
    "SELECT * FROM patients.info WHERE full_name ILIKE $1",
    [`%${content}%`]
  );

  return query.rows;
};

export { HandlePatientBasicInfo, HandleNewPatient, SearchPatientByName };
