import { customAlphabet } from "nanoid";

/**
 * Create ID for bedticket.
 * Alphabetic 16 chars long
 *
 * @return {*}  {Promise<string>}
 */
const CreateBedTicketID = async (): Promise<string> => {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    16
  );

  const id = await nanoid();
  return id;
};

export { CreateBedTicketID };
