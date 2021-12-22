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
     * @interface BasicDetails
     */
    export interface BasicDetails {
      [key: string]: any;
      firstname: string;
      lastname: string;
      dob?: Date;
      gender: "male" | "female" | "other";
      marital: "married" | "unmarried";
      address: string;
      grama_niladhari?: string;
      divisional_sector?: string;
      contact_number: number;
      phi_tp?: number;
      moh_tp?: number;
      living_with: string;
      lw_name?: string;
      lw_address?: string;
      lw_tp?: number;
      edu_status?: string[];
      has_job: boolean;
      job?: string;
      gov_facilities?: string;
      diseases: string;
      treatment_his?: string[];
      last_clinic_visit?: Date;
      informed_over_phone?: Date;
      home_visit?: Date;
      next_clinic_date?: Date;
      hospital_admission: string;
    }

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
}
