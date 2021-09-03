declare namespace API {
  namespace Auth {
    /**
     * Data passing with the jwt
     *
     * @export
     * @interface UserData
     */
    export interface UserData {
      id: number;
      fname: string;
      lname: string;
      username: string;
    }

    /**
     * Return type when the backend successfully executed the
     * username & password checking (no matter password is
     * correct or incorrect)
     *
     * @export
     * @interface LoginResponse
     */
    export interface LoginResponse {
      success: boolean;
      user?: UserData;
      access?: string;
      refresh?: string;
      err?: string;
    }
  }
}
