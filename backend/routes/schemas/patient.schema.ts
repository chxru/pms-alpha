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
    errorMessage: "Last name is required",
    trim: true,
  },
  gender: {
    in: "body",
    isString: true,
    errorMessage: "Gender is required",
    trim: true,
  },
  "dob.d": {
    in: "body",
    isInt: true,
    optional: true,
  },
  "dob.m": {
    in: "body",
    isInt: true,
    optional: true,
  },
  "dob.y": {
    in: "body",
    isInt: true,
    optional: true,
  },
  address: {
    in: "body",
    isString: true,
    optional: true,
  },
  email: {
    in: "body",
    isEmail: true,
    optional: true,
  },
  tp: {
    in: "body",
    isString: true,
    optional: true,
  },
};

export { new_patient_schema };
