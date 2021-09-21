import fetch from "node-fetch";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const sr = await fetch("http://localhost:3448/users/count");

    if (!sr.ok) {
      throw new Error("internal server error");
    }

    const n = await sr.text();
    res.status(200).send(n);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}
