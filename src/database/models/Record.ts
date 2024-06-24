import mongoose from "mongoose";

export const recordSchema = new mongoose.Schema({
  requestType: {
    type: String,
    enum: ["addressChange", "somethinElse"],
    required: true,
  },
  state: {
    type: String,
    enum: ["Processing", "Intake"],
    required: true,
  },
});

export const Record =
  mongoose.model("Record") || mongoose.model("Record", recordSchema);
