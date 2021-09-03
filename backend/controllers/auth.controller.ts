import db from "../database/pg";
import { PMSDB } from "../database/types/db";

import { ComparePwd, HashPwd } from "../util/bcrypt";
import { DecodeJWT, GenerateJWT } from "../util/jwt";
import { logger } from "../util/logger";

interface RegisterData {
  email: string;
  username: string;
  fname: string;
  lname: string;
  password: string;
}

/**
 * Handle new user registration process
 *
 * @param {RegisterData} data
 * @return {*}  {Promise<{ access_token: string; refresh_token: string }>}
 */
const HandleRegister = async (
  data: RegisterData
): Promise<{ access_token: string; refresh_token: string }> => {
  try {
    const hashedPwd = await HashPwd(data.password);

    // saving in database
    const trx = await db.connect();
    let uid: number;
    try {
      // begin trasaction
      await trx.query("BEGIN");

      // insert data into users.data
      const q1 = await trx.query(
        "INSERT INTO users.data (email, fname, lname, username) VALUES ($1, $2, $3, $4) RETURNING id",
        [data.email, data.fname, data.lname, data.username]
      );

      // update uid
      uid = q1.rows[0].id;

      // insert data into users.auth
      await trx.query(
        "INSERT INTO users.auth (id, username, pwd) VALUES ($1, $2, $3)",
        [uid, data.username, hashedPwd]
      );

      // commiting
      await trx.query("COMMIT");
    } catch (error) {
      // rallback
      await trx.query("ROLLBACK");

      logger(
        "Error occured in HandleRegister transcation, rollbacked",
        "error"
      );
      throw error;
    } finally {
      trx.release();
    }

    // Generate JWT
    const access_token = await GenerateJWT(uid, "access");
    const refresh_token = await GenerateJWT(uid, "refresh");

    // save token in db
    const expires = new Date();
    expires.setDate(expires.getDate() + 1); // set expire date to 1 day
    await db.query(
      "INSERT INTO users.tokens (id, token, expires) VALUES ($1, $2, $3)",
      [uid, refresh_token, expires]
    );

    logger(`User ${data.username} is created`, "success");

    return { access_token, refresh_token };
  } catch (error) {
    logger("Error occured in HandleRegister", "error");
    throw error;
  }
};

/**
 * Handle user authentication process
 *
 * @param {string} username
 * @param {string} password
 * @return {*}  {(Promise<{
 *   user: Pick<PMSDB.users.data, "id" | "fname" | "lname" | "username">;
 *   access_token: string;
 *   refresh_token: string;
 * }>)}
 */
const HandleLogin = async (
  username: string,
  password: string
): Promise<{
  user: Pick<PMSDB.users.data, "id" | "fname" | "lname" | "username">;
  access_token: string;
  refresh_token: string;
}> => {
  // get user auth data
  const userAuthQuery = await db.query(
    "SELECT id, pwd FROM users.auth WHERE username=$1",
    [username]
  );

  if (userAuthQuery.rowCount === 0) {
    logger(`Username ${username} not found`, "info");
    throw new Error("Username not correct");
  }

  const userAuthData: Pick<PMSDB.users.auth, "id" | "pwd"> =
    userAuthQuery.rows[0];

  const res = await ComparePwd(password, userAuthData.pwd);
  if (!res) {
    throw new Error("Wrong username/password");
  }

  // get user data
  const userQuery = await db.query(
    "SELECT id, fname, lname, username FROM users.data WHERE id=$1",
    [userAuthData.id]
  );
  if (userQuery.rowCount === 0) {
    logger(
      `Could not fetch row for ${username}, id=${userAuthData.id}`,
      "error"
    );
    throw new Error("User data is missing in database, contact admin");
  }

  // grab user data from the query result
  const user: Pick<PMSDB.users.data, "id" | "fname" | "lname" | "username"> =
    userQuery.rows[0];

  const access_token = await GenerateJWT(user.id, "access");
  const refresh_token = await GenerateJWT(user.id, "refresh");

  // save token in db
  const expires = new Date();
  expires.setDate(expires.getDate() + 1); // set expire date to 1 day
  await db.query(
    "INSERT INTO users.tokens (id, token, expires) VALUES ($1, $2, $3)",
    [user.id, refresh_token, expires]
  );

  logger(`User ${user.username} logged in`, "success");
  return { user, access_token, refresh_token };
};

/**
 * Handle token refreshing.
 * When user requests a new refresh token with the access token,
 * function verify the access token and issue a new refresh token
 *
 * @param {string} token access
 * @return {*}  {(Promise<{
 *   ok: boolean;
 *   access?: string;
 *   user?: {id: string; fname: string; lname: string; email: string};
 * }>)}
 */
const HandleRefreshToken = async (
  token: string
): Promise<{
  ok: boolean;
  access?: string;
  user?: Pick<PMSDB.users.data, "id" | "fname" | "lname" | "email">;
}> => {
  try {
    // decode jwt
    const { ok, err, payload } = await DecodeJWT(token);

    if (!ok || !payload) {
      logger(err || "JWT Decode unknown error", "info");
      return { ok: false };
    }

    const uid = JSON.parse(payload).id;
    if (!uid) {
      logger("JWT Payload doesnt have uid value", "error");
      return { ok: false };
    }

    // check database for saved uid+token combinations
    const query = await db.query(
      "SELECT id, token FROM users.tokens WHERE id=$1 AND token=$2",
      [uid, token]
    );
    if (query.rowCount === 0) {
      throw new Error("No id, token combination found");
    }

    // generate new access token
    const access = await GenerateJWT(uid, "access");

    // get user data
    const userQuery = await db.query(
      "SELECT id, fname, lname, email FROM users.data WHERE id=$1",
      [uid]
    );
    if (userQuery.rowCount === 0) {
      logger(`Could not fetch token data for id=${uid}`, "error");
      throw new Error("User data is missing in database, contact admin");
    }

    // grab user data from the query result
    const user: Pick<PMSDB.users.data, "id" | "fname" | "lname" | "email"> =
      userQuery.rows[0];

    return { ok, access, user };
  } catch (error) {
    logger("Error occured while Handle Refresh Token", "error");
    console.log(error);
    return { ok: false };
  }
};

export { HandleLogin, HandleRegister, HandleRefreshToken };
