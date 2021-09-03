import fetch from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // filter POST requests
  if (req.method !== "POST") {
    res.status(403).send(`No ${req.method} requests accepted in this endpoint`);
    return;
  }

  // reply if no token came in the cookie
  const refresh: string | undefined = req.cookies.refresh_token;
  if (!refresh) {
    res.status(401).json({ err: "No token" });
    return;
  }

  // generate new access token from backend
  try {
    const sr = await fetch("http://localhost:3448/users/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (sr.ok) {
      const data = await sr.json();
      res.status(200).json(data);
      return;
    }

    res.status(403).send("server resoponse is not okay");
  } catch (error) {
    res.status(403).send(error);
  }
}
