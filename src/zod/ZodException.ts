export class ZodException extends Error {
  constructor(public errors: string) {
    super("Zod Validation Error");
  }
}
