import { PGDB } from ".";

export namespace API {
  /**
   * Default response format used in API
   *
   * @export
   * @interface Response
   */
  export interface Response<T = any> {
    success: boolean;
    err?: string;
    data?: T;
  }
  export namespace Auth {
    /**
     * Data passing with the jwt
     *
     * @export
     * @interface UserData
     */
    export interface UserData
      extends Pick<PGDB.User.Data, "id" | "fname" | "lname" | "username"> {}

    /**
     * Return type when the backend successfully executed the
     * username & password checking (no matter password is
     * correct or incorrect)
     *
     * @export
     * @interface LoginResponse
     */
    export interface LoginResponse {
      user: UserData;
      access: string;
      refresh: string;
    }
  }

  export namespace Diagnosis {
    export interface Data extends Omit<PGDB.Diagnosis.Data, "category"> {
      category: string;
    }

    export interface NewDiagnosisForm {
      category: number;
      name: string;
    }
  }

  export namespace Patient {
    /**
     * Basic data gathered from the patient
     *
     * @export
     * @interface RegistrationForm
     */
    export interface RegistrationForm
      extends Omit<
        PGDB.Patient.BasicDetails,
        "current_bedticket" | "bedtickets"
      > {}

    /**
     * Format what search request outputs
     *
     * @export
     * @interface SearchDetails
     */
    export interface SearchDetails {
      id: number;
      full_name: string;
    }

    export interface BedTicketDetails {
      adimission_date: string;
      discharged_date: string;
      records: {
        type: string;
      }[];
    }
  }

  export namespace Bedtickets {
    export interface Attachment {
      original_name: string;
      current_name: string;
      size: number;
      mimetype: string;
      created_at: Date;
    }
    export interface Entries
      extends Omit<
        PGDB.Bedtickets.Entries,
        "entry_id" | "ticket_id" | "attachments"
      > {
      attachments?: Attachment[];
    }
  }
}
