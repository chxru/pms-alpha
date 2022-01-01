import { customAlphabet, nanoid } from "nanoid";

/*
 * NanoID collision calculator
 * https://zelark.github.io/nano-id-cc/
 */

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

/**
 * Create unique file names
 *
 * @return {*}  {Promise<string>}
 */
const CreateFileName = async (): Promise<string> => {
  const id = await nanoid();
  return id;
};

/**
 * Create ID for patients
 *
 * @return {*}  {Promise<string>}
 */
const CreatePatientID = async (): Promise<string> => {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    8
  );

  const id = await nanoid();
  return id;
};
export { CreateBedTicketID, CreateFileName, CreatePatientID };
