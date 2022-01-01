import db from "database/pg";
import { DecryptData, EncryptData } from "util/crypto";
import { CreatePatientID } from "util/nanoid";

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
  id: string
): Promise<{ data?: PGDB.Patient.BasicDetails; err?: string }> => {
  const query = await db.query("SELECT * FROM patients.info WHERE uuid=$1", [
    id,
  ]);
  if (query.rowCount === 0) {
    return { err: "No patient found" };
  }

  const encrypted: PGDB.Patient.Info = query.rows[0];
  const data = DecryptData<PGDB.Patient.BasicDetails>(encrypted.data);
  return { data };
};

/**
 * @param {API.Patient.BasicDetails} data
 * @return {*}  {Promise<number>} patient id
 */
const HandleNewPatient = async (
  data: API.Patient.RegistrationForm
): Promise<string> => {
  const id = await CreatePatientID();
  const encrypted = EncryptData(JSON.stringify(data));
  const fullname = data.fname + " " + data.lname;

  const q = await db.query<{ uuid: string }>(
    "INSERT INTO patients.info (uuid, data, full_name) VALUES ($1, $2, $3) RETURNING uuid",
    [id, encrypted, fullname]
  );

  logger(`New patient ${fullname} registered`, "success");

  return q.rows[0].uuid;
};

const SearchPatientByName = async (
  content: string
): Promise<API.Patient.SearchDetails[]> => {
  if (!content) {
    return [];
  }

  // https://niallburkley.com/blog/index-columns-for-like-in-postgres/
  const query = await db.query<API.Patient.SearchDetails>(
    "SELECT uuid, full_name FROM patients.info WHERE full_name ILIKE $1",
    [`%${content}%`]
  );

  return query.rows;
};

export { HandlePatientBasicInfo, HandleNewPatient, SearchPatientByName };
