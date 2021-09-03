import { Schema } from "express-validator";

const signup_schema: Schema = {
  email: {
    in: "body",
    errorMessage: "Invalid email",
    isEmail: true,
    trim: true,
  },
  fname: {
    in: "body",
    isString: true,
    errorMessage: "Invalid First Name",
    trim: true,
  },
  lname: {
    in: "body",
    isString: true,
    errorMessage: "Invalid Last Name",
    trim: true,
  },
  username: {
    in: "body",
    isString: true,
    errorMessage: "Invalid username",
    isLength: {
      errorMessage: "Username must be atleast 5 letters",
      options: {
        min: 5,
      },
    },
    trim: true,
  },
  password: {
    in: "body",
    isStrongPassword: true,
    errorMessage: "Password isn't strong enough",
  },
};

const signin_schema: Schema = {
  username: {
    in: "body",
    errorMessage: "Invalid email",
    isEmail: true,
    trim: true,
  },
  password: {
    in: "body",
    isString: true,
    errorMessage: "Invalid password",
  },
};

export { signin_schema, signup_schema };
