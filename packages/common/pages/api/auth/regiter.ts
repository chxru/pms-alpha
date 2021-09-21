/* eslint-disable no-console */
import fetch from "node-fetch";
import { serialize } from "cookie";

import type { NextApiRequest, NextApiResponse } from "next";
import type { API } from "@pms-alpha/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    API.Response<{ user: API.Auth.UserData; access: string }>
  >
) {
  try {
    const sr = await fetch("http://localhost:3448/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(req.body),
    });

    const response = (await sr.json()) as API.Response<API.Auth.LoginResponse>;

    // 400 => invalid params, schema fails
    if (sr.status === 400) {
      res.status(400).json(response);
      return;
    }

    // 500 => internal server errors
    if (sr.status === 500) {
      res
        .status(500)
        .json({ success: false, err: "Error occured in internal server" });
    }

    // validate response data
    if (!response.data) {
      res.status(500).json({
        success: false,
        err: "Empty server response",
      });
      return;
    }

    const { user, access, refresh } = response.data;

    if (!access || !refresh) {
      res.status(500).json({ success: false, err: "Tokens are missing" });
      return;
    }

    const header = serialize("refresh_token", refresh, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: true,
    });

    res.setHeader("Set-Cookie", header);
    res.status(200).json({ success: true, data: { user, access } });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      err: "Error occured in next server",
    });
  }
}
