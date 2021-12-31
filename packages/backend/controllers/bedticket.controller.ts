import db from "database/pg";
import { DecryptData, EncryptData } from "util/crypto";

import { logger } from "@pms-alpha/shared";
import { CreateBedTicketID } from "util/nanoid";

import type { API, PGDB } from "@pms-alpha/types";

/**
 * Create new bed ticket
 *
 * @param {string} pid patient id
 * @return {*}  {Promise<void>}
 */
const HandleNewBedTicket = async (pid: string): Promise<void> => {
  const id = parseInt(pid);
  if (isNaN(id)) {
    throw new Error("PID is not a number");
  }

  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    // fetch patient data from database
    const q1 = await trx.query("SELECT data FROM patients.info WHERE id=$1", [
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
};

/**
 * Add new entry to bed ticket table
 *
 * @param {string} bid bed ticket id
 * @param {PGDB.Bedtickets.Entries} data
 * @return {*}  {Promise<void>}
 */
const HandleNewEntry = async (
  bid: string,
  data: PGDB.Bedtickets.Entries,
  files:
    | Express.Multer.File[]
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined
): Promise<void> => {
  // start transaction
  const trx = await db.connect();
  try {
    await trx.query("BEGIN");

    // strigify files
    const temp_files: API.Bedtickets.Attachment[] = [];
    if (Array.isArray(files)) {
      for (const file of files) {
        temp_files.push({
          original_name: file.originalname,
          current_name: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          created_at: new Date(),
        });
      }
    }
    const files_string = JSON.stringify(temp_files);

    // insert entry to bedtickets.entries
    await trx.query<{ entry_id: number }>(
      "INSERT INTO bedtickets.entries (category, topic, note, diagnosis, attachments, ticket_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING entry_id",
      [data.category, data.topic, data.note, data.diagnosis, files_string, bid]
    );

    // commiting
    await trx.query("COMMIT");
  } catch (error) {
    await trx.query("ROLLBACK");

    logger("Error occured while HandleNewEntry transaction", "error");
    throw error;
  } finally {
    trx.release();
  }
};

/**
 * Real all entries of bed ticket
 *
 * @param {string} bid
 * @return {*}
 */
const HandleReadEntries = async (
  bid: string
): Promise<{ data: API.Bedtickets.Entries[] }> => {
  interface QueryResult extends Omit<API.Bedtickets.Entries, "attachments"> {
    attachments: string;
  }

  const query = await db.query<QueryResult>(
    "SELECT category, topic, note, diagnosis, attachments, created_at FROM bedtickets.entries WHERE ticket_id=$1",
    [bid]
  );

  const data: API.Bedtickets.Entries[] = [];
  for (const e of query.rows) {
    data.push({
      ...e,
      attachments: JSON.parse(e.attachments),
    });
  }

  return { data };
};

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
    const q1 = await trx.query("SELECT data FROM patients.info WHERE id=$1", [
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
    await trx.query("UPDATE patients.info SET data=$1 WHERE id=$2", [
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

export {
  HandleNewBedTicket,
  HandleNewEntry,
  HandleReadEntries,
  HandleDischarge,
};
