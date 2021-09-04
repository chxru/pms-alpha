/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import fetch, { RequestInit } from "node-fetch";

const VerifyJWT = async (token: string) => {
  return new Promise<void>((resolve, reject) => {
    if (!process.env.JWT_ACCESS_TOKEN) {
      reject(new Error("Env variable JWT_ACCESS_TOKEN is missing"));
      return;
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const body = req.body;
  const { token, method } = body;

  // delete unwanted fields in req.body before sending to backend
  delete body["token"];
  delete body["method"];

  try {
    // verify jwt token is valid
    await VerifyJWT(token);
  } catch (error) {
    console.log(error);
    res.status(403).json({ err: "JWT Verification failed" });
    return;
  }

  try {
    // fetch request option
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    };

    // insert body to request if method is POST
    if (method === "POST" && typeof body === "object") {
      options.body = JSON.stringify(body);
    }

    const url = typeof slug === "string" ? slug : slug.join("/");
    const response = await fetch(`http://localhost:3448/${url}`, options);

    if (!response.ok) {
      // 400 => schema validation failed
      if (response.status === 400) {
        const data = (await response.json()) as any;
        res.status(400).json({ ...data });
        return;
      }

      // 500 => backend errors
      if (response.status === 500) {
        res
          .status(500)
          .json({ err: "Internal server error occured, contact admin" });
      }
      return;
    }

    const data = (await response.json()) as any;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(502).json({ err: error });
  }
}
