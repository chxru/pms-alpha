import db from "../database/pg";
import { DecryptData, EncryptData } from "../util/crypto";
import { logger } from "../util/logger";

import type { PGDB } from "types/pg";

/**
 * Create new bed ticket
 *
 * @param {string} pid
 * @return {*}  {Promise<{ err?: string }>}
 */
const HandleNewBedTicket = async (pid: string): Promise<{ err?: string }> => {
  const id = parseInt(pid);
  if (isNaN(id)) {
    return { err: "ID is not a number" };
  }

  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    // fetch patient data from database
    const q1 = await trx.query("SELECT data FROM patients.info WHERE id=$1", [
      id,
    ]);

    if (q1.rowCount === 0) {
      return { err: "User ID not found" };
    }

    // decrypting data
    const decrypted = DecryptData<PGDB.Patient.BasicDetails>(q1.rows[0].data);

    if (decrypted.current_bedticket) {
      return { err: "User already has an active bed ticket" };
    }

    // save bed ticket in database
    const q2 = await trx.query(
      "INSERT INTO patients.bedtickets DEFAULT VALUES RETURNING id "
    );

    // storing bed ticket
    const bid: number = q2.rows[0].id;

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
    await trx.query("UPDATE patients.info SET data=$1 WHERE id=$2", [
      encrypted,
      pid,
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
  return { err: undefined };
};

/**
 * Add new entry to bed ticket table
 *
 * @param {string} bid
 * @param {PGDB.Patient.BedTicketEntry} data
 * @return {*}  {Promise<{ err?: string }>}
 */
const HandleNewEntry = async (
  bid: string,
  data: PGDB.Patient.BedTicketEntry
): Promise<{ err?: string }> => {
  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    const q1 = await trx.query(
      "SELECT records FROM patients.bedtickets WHERE id=$1",
      [bid]
    );

    if (q1.rowCount === 0) {
      return { err: "Bed Ticket ID not found" };
    }

    const records = q1.rows[0].records;

    // decrypting data
    const decrypted =
      records === null
        ? [] // in fresh bed tickets records is null
        : DecryptData<PGDB.Patient.BedTicketEntry[]>(records);

    // insert new entry to saved array
    decrypted.unshift({
      ...data,
      created_at: new Date(),
      id: decrypted.length + 1,
    });

    // encrypting again
    const encrypted = EncryptData(JSON.stringify(decrypted));

    // updating database
    await trx.query("UPDATE patients.bedtickets SET records=$1 WHERE id=$2", [
      encrypted,
      bid,
    ]);

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    await trx.query("ROLLBACK");

    logger("Error occured while HandleNewEntry transaction", "error");
    throw error;
  } finally {
    trx.release();
  }

  return { err: undefined };
};

/**
 * Real all entries of bed ticket
 *
 * @param {string} bid
 * @return {*}
 */
const HandleReadEntries = async (
  bid: string
): Promise<{ data?: PGDB.Patient.BedTicketEntry[]; err?: string }> => {
  try {
    const query = await db.query(
      "SELECT records FROM patients.bedtickets WHERE id=$1",
      [bid]
    );

    if (query.rowCount === 0) {
      return { err: "Bed Ticket ID not found" };
    }

    const records = query.rows[0].records;

    // decrypting data
    const decrypted =
      records === null
        ? [] // in fresh bed tickets records is null
        : DecryptData<PGDB.Patient.BedTicketEntry[]>(records);

    return { data: decrypted };
  } catch (error) {
    logger("Error occured while HandleNewEntry transaction", "error");
    console.log(error);

    return { err: "Error occured while fetching new entries" };
  }
};

export { HandleNewBedTicket, HandleNewEntry, HandleReadEntries };
