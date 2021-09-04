import db from "../database/pg";
import { EncryptData } from "../util/crypto";

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

export { HandleNewPatient };
