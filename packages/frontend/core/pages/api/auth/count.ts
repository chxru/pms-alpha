import fetch from "node-fetch";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) {
      throw new Error("baseUrl Not found");
    }

    const sr = await fetch(`${baseUrl}/users/count`);

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
