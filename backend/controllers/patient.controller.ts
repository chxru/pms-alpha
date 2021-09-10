import db from "../database/pg";
import { DecryptData, EncryptData } from "../util/crypto";
import { logger } from "../util/logger";

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
  const encrypted = EncryptData(JSON.stringify(data));
  const fullname = data.firstname + " " + data.lastname;

  let pid: number;

  // begin transaction
  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    // save encrypted data in patients.info
    const q1 = await db.query(
      "INSERT INTO patients.info (data) VALUES ($1) RETURNING id",
      [encrypted]
    );

    // get patient id
    pid = q1.rows[0].id;

    // insert full name to patients.search
    await trx.query("INSERT INTO patients.search VALUES ($1, $2)", [
      pid,
      fullname,
    ]);

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    // rallback
    await trx.query("ROLLBACK");

    logger(
      "Error occured in HandleNewPatient transcation, rollbacked",
      "error"
    );
    throw error;
  } finally {
    trx.release();
  }

  return pid;
};

const SearchPatientByName = async (
  content: string
): Promise<API.Patient.SearchDetails[]> => {
  if (!content) {
    return [];
  }

  const query = await db.query(
    "SELECT * FROM patients.search WHERE full_name ILIKE $1",
    [`%${content}%`]
  );

  return query.rows;
};

export { HandlePatientBasicInfo, HandleNewPatient, SearchPatientByName };
