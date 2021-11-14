import type { API } from "./api";

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
    export interface BasicDetails extends API.Patient.BasicDetails {
      id: number;
      current_bedticket?: number;
      bedtickets: {
        admission_date: number;
        discharge_date?: number;
        id: number;
      }[];
    }

    export interface BedTicketEntry {
      id: number;
      category: "diagnosis" | "report" | "other";
      type: string;
      note: string;
      attachments: {
        originalName: string;
        fileName: string;
        size: number;
        mimetype: string;
      }[];
      created_at: Date;
    }

    export interface Encrypted {
      id: number;
      data: string;
      created_at: Date;
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
}
