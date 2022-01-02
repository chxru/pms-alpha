import db from "@pms-alpha/server/database/pg";
import { logger } from "@pms-alpha/shared";

import type { API, PGDB } from "@pms-alpha/types";

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
      "INSERT INTO bedtickets.entries (category, note, diagnosis, attachments, ticket_id) VALUES ($1, $2, $3, $4, $5) RETURNING entry_id",
      [data.category, data.note, data.diagnosis, files_string, bid]
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

export default HandleNewEntry;
