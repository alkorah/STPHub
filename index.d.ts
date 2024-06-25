import { HttpResponseInit } from "@azure/functions";

declare global {
  type IntakePayload = {};

  enum State {
    Intake = "Intake",
    Processing = "Processing",
  }

  enum RequestType {
    AddressChange = "AddressChange",
  }

  type TestHttpPayload = {};

  type AllPayloads = IntakePayload | TestHttpPayload;
}
