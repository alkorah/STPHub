import mongoose from "mongoose";

export const recordSchema = new mongoose.Schema({
  RequestType: {
    type: String,
    enum: ["AddressChange", "somethinElse"],
    required: true,
  },
  State: {
    type: String,
    enum: ["Processing", "Intake"],
    required: true,
  },
});

export const Record = mongoose.model("Record", recordSchema);
