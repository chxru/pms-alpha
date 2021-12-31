import db from "database/pg";

import type { API } from "@pms-alpha/types";

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
    "SELECT category, note, diagnosis, attachments, created_at FROM bedtickets.entries WHERE ticket_id=$1",
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

export default HandleReadEntries;
