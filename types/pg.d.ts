declare namespace PGDB {
  namespace User {
    export interface Data extends API.Auth.UserData {
      id: number;
      created_at: Date;
      updated_at: Date;
      created_by: number;
    }

    export interface Auth {
      id: number;
      username: string;
      pwd: string;
    }

    export interface Token {
      id: number;
      token: string;
      expires: Date;
      blacklisted: boolean;
    }
  }

  namespace Patient {
    export interface BasicDetails extends API.Patient.BasicDetails {
      id: number;
      created_at: Date;
    }

    export interface Encrypted {
      id: number;
      data: string;
      created_at: Date;
    }
  }
}
