import { logger } from "@pms-alpha/common/util/logger";
import type { API } from "@pms-alpha/types";

interface request {
  path: string;
  method: "GET" | "POST";
  obj?:
    | {
        [key: string]: any;
      }
    | FormData;
  token?: string;
}

/**
 * Do the fetching requests to api though next-server with jwt access token
 *
 * @template T
 * @param {request} {
 *   path,
 *   method,
 *   obj,
 * token,
 * }
 * @return {*}  {Promise<response<T>>}
 */
const ApiRequest = async <T,>({
  path,
  method,
  obj,
  token,
}: request): Promise<API.Response<T>> => {
  logger(`url: ${method} ${path}, obj: ${obj}, hasToken: ${!!token}`);

  // access token is required
  if (!token) {
    return { success: false, err: "Token is missing" };
  }

  try {
    // setup headers
    const headers = new Headers({});

    if (method == "GET" || !(obj instanceof FormData)) {
      headers.append("Content-Type", "application/json;charset=utf-8");
    }
    headers.append("Authorization", token);

    // send requests to backend
    // TODO: no hard coded URLs
    const response = await fetch(`http://localhost:3448/${path}`, {
      method,
      headers,
      body: obj instanceof FormData ? obj : JSON.stringify(obj),
    });

    if (!response.ok) {
      try {
        const { err } = await response.json();
        // schema validation errors
        if (response.status === 400) {
          let e = err.split("\n")[0];
          e = e.split(":").pop().trim();
          return { success: false, err: e };
        }
        return { success: false, err };
      } catch (error) {
        console.log(response.status);
        console.log(error);
        return { success: false, err: "Unknown error" };
      }
    }

    const { success, data, err } = (await response.json()) as API.Response<T>;
    return { success, data, err };
  } catch (error) {
    logger(`Error occured in request ${path}`, "info");
    console.error(error);
    return { success: false, err: "Something went wrong" };
  }
};

export { ApiRequest };
