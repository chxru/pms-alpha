import { Schema } from "express-validator";

const new_bedticket_schmea: Schema = {
  id: {
    in: "params",
  },
};

export { new_bedticket_schmea };
