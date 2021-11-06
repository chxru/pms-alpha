import * as jwt from "jsonwebtoken";
import { logger } from "@pms-alpha/common/util/logger";

/**
 * Generate Json web token
 *
 * @param {number} id User ID
 * @param {("refresh" | "access")} type
 * @return {*}  {Promise<string>}
 */
const GenerateJWT = (
  id: number,
  type: "refresh" | "access"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const token =
      type === "refresh"
        ? process.env.JWT_REFRESH_TOKEN
        : process.env.JWT_ACCESS_TOKEN;

    if (!token) {
      reject(
        new Error(`Token secret for ${type} is empty. Check env variables`)
      );
      return;
    }

    // refresh token 7days, access token 20mins
    const expiresIn = type === "refresh" ? "7d" : 60 * 20;

    jwt.sign({ id }, token, { expiresIn }, (err, token) => {
      if (token) {
        resolve(token);
      }

      // reject if no token is generated
      reject(err);
    });
  });
};

/**
 * Validate and Decode JWT
 *
 * @param {string} token
 * @return {*}
 */
const DecodeJWT = (
  token: string
): Promise<{ ok: boolean; err?: string; payload?: string }> => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_REFRESH_TOKEN) {
      reject(
        new Error(
          "Token secret for refresh token is empty. Check env variables"
        )
      );
      return;
    }

    // verify jwt
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN, (err) => {
      if (err) {
        resolve({ ok: false, err: err.message });
      }

      // decode jwt
      const decoded = jwt.decode(token);
      resolve({ ok: true, payload: JSON.stringify(decoded) });
    });
  });
};

const VerifyJWT = (token: string): boolean => {
  if (!process.env.JWT_ACCESS_TOKEN) {
    logger("JWT_REFRESH_TOKEN is missing", "error");
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    return true;
  } catch (error) {
    logger("Catched in verifyJwt " + error, "info");
    return false;
  }
};

export { GenerateJWT, DecodeJWT, VerifyJWT };
