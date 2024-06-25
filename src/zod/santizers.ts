import z from "zod";
import { ZodException } from "./ZodException";

const intakePayloadSchema = z.object({});

export function readFromIntakePayloadSanitizer(
  payload: unknown
): IntakePayload {
  const result = intakePayloadSchema.safeParse(payload);

  if (result.error) {
    throw new ZodException(result.error.errors.join(", "));
  }

  return result.data as IntakePayload;
}

const testHttpPayloadSchema = z.object({
  state: z.nativeEnum(State),
  requestType: z.nativeEnum(RequestType),
});

export function testHttpPayloadSanitizer(payload: unknown): TestHttpPayload {
  const result = testHttpPayloadSchema.safeParse(payload);

  if (result.error) {
    throw new ZodException(result.error.errors.join(", "));
  }

  return result.data as TestHttpPayload;
}
