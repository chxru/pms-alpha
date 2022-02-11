import db from "@pms-alpha/server/database/pg";
import { DecryptData, EncryptData } from "@pms-alpha/server/util/crypto";

import { logger } from "@pms-alpha/shared";

import type { PGDB } from "@pms-alpha/types";

/**
 * Discharge patient by updating bed ticket
 *
 * @param {string} pid Patient ID
 * @return {*}  {Promise<{ err?: string }>}
 */
const HandleDischarge = async (pid: string): Promise<void> => {
  /*
    1. Fetch general information of patient, decrypt it
    2. Update current_bedticket to undefined
    3. Update discharge_date to current time
    4. 
  */

  const trx = await db.connect();

  try {
    await trx.query("BEGIN");

    // fetch patient data
    const q1 = await trx.query("SELECT data FROM patients.info WHERE uuid=$1", [
      pid,
    ]);

    if (q1.rowCount === 0) {
      throw new Error("User ID not found");
    }

    // decrypting data
    const decrypted = DecryptData<PGDB.Patient.BasicDetails>(q1.rows[0].data);

    if (!decrypted.current_bedticket) {
      throw new Error("User doesn't have an active bed ticket");
    }

    // set current bedticket undefined
    const bid = decrypted.current_bedticket;
    decrypted.current_bedticket = undefined;

    // filter the entry with bid, add discharge timestamp
    const entry = decrypted.bedtickets.filter(
      (e) => e.id === decrypted.current_bedticket
    );

    for (const e of entry) {
      if (e.id === decrypted.current_bedticket) {
        e.discharge_date = Date.now();
      }
    }

    // encrypting updated data
    const encrypted = EncryptData(JSON.stringify(decrypted));

    // updating database
    await trx.query("UPDATE patients.info SET data=$1 WHERE uuid=$2", [
      encrypted,
      pid,
    ]);

    // updating discharge date on bedtickets.ticket
    // TODO: Add user id
    await trx.query(
      "UPDATE bedtickets.tickets SET discharged_at = now(), discharged_by = 1 WHERE ticket_id=$1",
      [bid]
    );

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    // rollback
    await trx.query("ROLLBACK");

    logger("Error occured while HandleNewBedTicket transaction", "error");
    throw error;
  } finally {
    trx.release();
  }
};

export default HandleDischarge;
