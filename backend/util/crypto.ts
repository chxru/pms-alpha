import { createCipheriv, createDecipheriv, createHash } from "crypto";
import type { API } from "types/api";

/*
  For reference 
  https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options
  https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#how-to-use-cipher-algorithms-with-crypto
  https://github.com/pms-lk/pms-desktop/blob/master/src/database/crypto/cipher.ts

  Below two functions were copied from one of my previous projects.
  There are some conflicts/doubts with below implementation and docs
  But, it works 💀
*/

const ALGO = "aes256"; // TODO: cbc? gcm?
const KEYPHASE = "3a6f0aa4866e7ee0d90f811eb68d00b7"; // TODO: Move it more secure

/**
 * Encrypt JSON object
 *
 * @param {API.Patient.BasicDetails} data
 * @return {*}  {string}
 */
const EncryptData = (data: API.Patient.BasicDetails): string => {
  const iv = Buffer.alloc(16, 0); // initialization vector
  const key = createHash("sha256").update(KEYPHASE).digest();
  const cipher = createCipheriv(ALGO, key, iv);

  // create a string of cipher text including the iv
  const encrypted = Buffer.concat([
    iv,
    cipher.update(JSON.stringify(data)),
    cipher.final(),
  ]);

  return encrypted.toString("base64");
};

/**
 * Decrypt given string to JSON object
 *
 * @param {string} data
 * @return {*}  {PMSDB.patients.info_decrypted}
 */
const DecryptData = <T>(data: string): T => {
  // create buffer from data
  const buffer = Buffer.from(data, "base64");

  // split iv and data from the ciphertext
  const iv = buffer.slice(0, 16);
  const encrypted = buffer.slice(16);

  const key = createHash("sha256").update(KEYPHASE).digest();

  const decipher = createDecipheriv(ALGO, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString());
};

export { EncryptData, DecryptData };
