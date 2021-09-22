import { pbkdf2, randomBytes } from "crypto";
import { getPassword, setPassword } from "keytar";

/**
 * Save database encryption key using `keytar`.
 * When the first user of the database is created (id = 0)
 * this function executes. Password is converted to a string
 * using PBKDF2 and save inside os
 *
 * @param password
 */
const SaveDBKey = async (password: string): Promise<void> => {
  pbkdf2(password, randomBytes(256), 100000, 64, "sha512", async (err, key) => {
    if (err) throw err;

    const hex = key.toString("hex");

    await setPassword("pms-alpha", "db", hex);
  });
};

/**
 * Retreive key from keystore
 *
 * @return {*}  {Promise<string> }
 */
const GetDBKey = async (): Promise<string> => {
  const key = await getPassword("pms-alpha", "db");
  if (!key) throw new Error("Key not found");
  return key;
};

export { GetDBKey, SaveDBKey };
