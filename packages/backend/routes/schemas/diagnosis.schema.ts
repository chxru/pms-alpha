import { Schema } from "express-validator";

const new_diagnosis_schema: Schema = {
  name: {
    in: "body",
    trim: true,
    isString: true,
  },
  category: {
    in: "body",
    trim: true,
    isString: true,
  },
};

export { new_diagnosis_schema };
