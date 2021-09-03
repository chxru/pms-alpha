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

const HandleNewPatient = async (
  data: PatientRegistrationData
): Promise<void> => {
  const encrypted = EncryptData(data);

  // save data in database
  await db.query("INSERT INTO patients.info (data) VALUES ($1)", [encrypted]);
};

export { HandleNewPatient };
