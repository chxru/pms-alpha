import db from "@pms-alpha/server/database/pg";
import { DecryptData, EncryptData } from "@pms-alpha/server/util/crypto";
import { CreateBedTicketID } from "@pms-alpha/server/util/nanoid";

import { logger } from "@pms-alpha/shared";

import type { PGDB } from "@pms-alpha/types";

/**
 * Create new bed ticket
 *
 * @param {string} pid patient id
 * @return {*}  {Promise<void>}
 */
const HandleNewBedTicket = async (id: string): Promise<void> => {
  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    // fetch patient data from database
    const q1 = await trx.query("SELECT data FROM patients.info WHERE uuid=$1", [
      id,
    ]);

    if (q1.rowCount === 0) {
      throw new Error("PID not found");
    }

    // decrypting data
    const decrypted = DecryptData<PGDB.Patient.BasicDetails>(q1.rows[0].data);

    // prevent creating new bed tickets when one is currently active
    if (decrypted.current_bedticket) {
      throw new Error("User already has an active bed ticket");
    }

    // create new bedticket id
    const bid = await CreateBedTicketID();

    // create new bed ticket in database
    // TODO: Insert user id for this query
    await trx.query(
      "INSERT INTO bedtickets.tickets (ticket_id, created_by) VALUES ($1, $2)",
      [bid, 1]
    );

    // updating patient document
    decrypted.current_bedticket = bid;

    // bedtickets array doesnt exists initially
    if (!decrypted.bedtickets) {
      decrypted.bedtickets = [{ admission_date: Date.now(), id: bid }];
    } else {
      decrypted.bedtickets.push({ admission_date: Date.now(), id: bid });
    }

    // encrypting updated patient document
    const encrypted = EncryptData(JSON.stringify(decrypted));

    // updating database
    await trx.query("UPDATE patients.info SET data=$1 WHERE uuid=$2", [
      encrypted,
      id,
    ]);

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

export default HandleNewBedTicket;
