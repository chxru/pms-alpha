import type { API } from "@pms-alpha/types";

interface request {
  path: string;
  method: "GET" | "POST";
  obj?: {
    [key: string]: any;
  };
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
  // access token is required
  if (!token) {
    return { success: false, err: "Token is missing" };
  }

  try {
    // send requests to next api as a post request
    const response = await fetch(`/api/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ ...obj, token, method }),
    });

    if (!response.ok) {
      const { err } = await response.json();
      // schema validation errors
      if (response.status === 400) {
        let e = err.split("\n")[0];
        e = e.split(":").pop().trim();
        return { success: false, err: e };
      }
      return { success: false, err };
    }

    const data: T = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, err: error };
  }
};

export { ApiRequest };
