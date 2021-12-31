export namespace PGDB {
  export namespace User {
    export interface Data {
      id: number;
      fname: string;
      lname: string;
      username: string;
      pwd: string;
      created_at: Date;
      updated_at: Date;
      created_by?: number;
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

  export namespace Patient {
    export interface Info {
      id: number;
      uuid: string;
      full_name: string;
      data: string;
      created_at: string;
    }

    /**
     * Data encrypted inside the Patient.Info.Data
     *
     * @export
     * @interface BasicDetails
     */
    export interface BasicDetails {
      fname: string;
      lname?: string;
      dob?: string;
      gender: "male" | "female" | "other";
      internal_id?: string;
      guardian: {
        fname: string;
        lname?: string;
        nic?: string;
        mobile: string;
        tp?: string;
        address?: string;
      };
      current_bedticket?: string;
      bedtickets: {
        admission_date: number;
        discharge_date?: number;
        id: string;
      }[];
    }
  }

  export namespace Diagnosis {
    export interface Categories {
      id: number;
      name: string;
    }

    export interface Data {
      id: number;
      category: number;
      name: string;
    }
  }

  export namespace Bedtickets {
    export interface Tickets {
      ticket_id: string;
      created_at: string;
      discharged_at?: string;
      created_by: number;
      discharged_by?: number;
    }

    export interface Entries {
      entry_id: number;
      category: "diagnosis" | "report" | "other";
      diagnosis?: number;
      note?: string;
      attachments: string;
      ticket_id: string;
      created_at: string;
    }
  }
}
