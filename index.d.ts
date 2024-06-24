import { HttpResponseInit } from "@azure/functions";

declare global {
  type PrimitiveData = number | string;

  type JSONData = Record<string, PrimitiveData>;

  type ParsedData = JSONData | PrimitiveData;

  type GenericPayload = Record<string, ParsedData>;
}
