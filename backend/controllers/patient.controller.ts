import db from "../database/pg";
import { EncryptData } from "../util/crypto";

interface PatientRegistrationData {
  fname: string;
  lname: string;
  gender: string;
  dob: {
    d?: number;
    m?: number;
    y?: number;
  };
  address?: string;
  email?: string;
  tp?: string;
}

/**
 * @param {PatientRegistrationData} data
 * @return {*}  {Promise<number>} patient id
 */
const HandleNewPatient = async (
  data: PatientRegistrationData
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
