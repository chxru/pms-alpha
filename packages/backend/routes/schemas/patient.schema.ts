import { Schema } from "express-validator";

const new_patient_schema: Schema = {
  fname: {
    in: "body",
    isString: true,
    errorMessage: "First name is required",
    trim: true,
  },
  lname: {
    in: "body",
    isString: true,
    errorMessage: "Last name is not a string",
    trim: true,
  },
  gender: {
    in: "body",
    isString: true,
    errorMessage: "Gender is required",
    isIn: {
      options: [["male", "female", "other"]],
      errorMessage: "Gender should be male, female or other",
    },
  },
  dob: {
    in: "body",
    matches: {
      options: [/\d{4}-\d{2}-\d{2}/], // regex to yyyy-mm-dd
      errorMessage: "dob should be yyyy-mm-dd format",
    },
    optional: true,
  },
  internal_id: {
    in: "body",
    isString: true,
  },
  "guardian.fname": {
    in: "body",
    isString: true,
    errorMessage: "Guarding first name is required",
    trim: true,
  },
  "guardian.lname": {
    in: "body",
    isString: true,
    errorMessage: "Last name is not a string",
    trim: true,
  },
  "guardian.nic": {
    in: "body",
    isString: true,
    trim: true,
  },
  "guardian.address": {
    in: "body",
    isString: true,
    trim: true,
    errorMessage: "Address is required",
  },
  "guardian.mobile": {
    in: "body",
    isMobilePhone: true,
    errorMessage: "Valid mobile number is required",
  },
  "guardian.tp": {
    in: "body",
    isMobilePhone: true,
    errorMessage: "Valid mobile number is required",
    trim: true,
    optional: true,
  },
};

const search_patient_schema: Schema = {
  search: {
    in: "body",
    isString: true,
    trim: true,
    errorMessage: "Search context is required",
  },
};

export { new_patient_schema, search_patient_schema };
