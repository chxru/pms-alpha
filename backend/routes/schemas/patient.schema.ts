import { Schema } from "express-validator";

const new_patient_schema: Schema = {
  firstname: {
    in: "body",
    isString: true,
    errorMessage: "First name is required",
    trim: true,
  },
  lastname: {
    in: "body",
    isString: true,
    errorMessage: "Last name is required",
    trim: true,
  },
  gender: {
    in: "body",
    isString: true,
    errorMessage: "Gender is required",
    isIn: {
      options: [["male", "female"]],
      errorMessage: "Gender should be male or female",
    },
  },
  dob: {
    in: "body",
    isString: true,
    matches: {
      options: [/\d{4}-\d{2}-\d{2}/], // regex to yyyy-mm-dd
      errorMessage: "dob should be yyyy-mm-dd format",
    },
    optional: true,
  },
  marital: {
    in: "body",
    isString: true,
    errorMessage: "Marital status is required",
    isIn: {
      options: [["married", "unmarried"]],
      errorMessage: "Invalid marital status",
    },
  },
  address: {
    in: "body",
    isString: true,
    trim: true,
    errorMessage: "Address is required",
  },
  grama_niladhari: {
    in: "body",
    isString: true,
    trim: true,
    optional: true,
  },
  divisional_sector: {
    in: "body",
    isString: true,
    trim: true,
    optional: true,
  },
  contact_number: {
    in: "body",
    isMobilePhone: true,
    errorMessage: "Valid mobile number is required",
  },
  phi_tp: {
    in: "body",
    isMobilePhone: true,
    optional: true,
  },
  moh_tp: {
    in: "body",
    isMobilePhone: true,
    optional: true,
  },
  living_with: {
    in: "body",
    isIn: {
      options: [["alone", "spouse", "sibilings", "children", "relations"]],
      errorMessage: "Invalid option for living with",
    },
  },
  lw_name: {
    in: "body",
    optional: true,
    isString: true,
    trim: true,
  },
  lw_address: {
    in: "body",
    optional: true,
    isString: true,
    trim: true,
  },
  lw_tp: {
    in: "body",
    optional: true,
    isMobilePhone: true,
  },
  edu_status: {
    in: "body",
    // TODO: validate possible inputs here
    isArray: {
      options: {
        min: 0,
        max: 3,
      },
    },
    optional: true,
  },
  has_job: {
    in: "body",
    isIn: {
      options: [["true", "false"]],
      errorMessage: "Job status must be true or false",
    },
    toBoolean: true,
  },
  job: {
    in: "body",
    isString: true,
    optional: true,
    trim: true,
  },
  gov_facilities: {
    in: "body",
    isString: true,
    optional: true,
    trim: true,
  },
  diseases: {
    in: "body",
    isString: true,
    optional: true,
    trim: true,
  },
  treatment_his: {
    in: "body",
    // TODO: validate possible inputs here
    isArray: {
      options: {
        min: 0,
        max: 3,
      },
    },
    optional: true,
  },
  last_clinic_visit: {
    in: "body",
    isString: true,
    matches: {
      options: [/\d{4}-\d{2}-\d{2}/], // regex to yyyy-mm-dd
      errorMessage: "Last clinic date should be yyyy-mm-dd format",
    },
    optional: true,
  },
  informed_over_phone: {
    in: "body",
    isString: true,
    matches: {
      options: [/\d{4}-\d{2}-\d{2}/], // regex to yyyy-mm-dd
      errorMessage: "Informed over phone date should be yyyy-mm-dd format",
    },
    optional: true,
  },
  home_visit: {
    in: "body",
    isString: true,
    matches: {
      options: [/\d{4}-\d{2}-\d{2}/], // regex to yyyy-mm-dd
      errorMessage: "Home visit date should be yyyy-mm-dd format",
    },
    optional: true,
  },
  next_clinic_date: {
    in: "body",
    isString: true,
    matches: {
      options: [/\d{4}-\d{2}-\d{2}/], // regex to yyyy-mm-dd
      errorMessage: "Next clinic date should be yyyy-mm-dd format",
    },
    optional: true,
  },
  hospital_admission: {
    in: "body",
    isString: true,
  },
};

export { new_patient_schema };
