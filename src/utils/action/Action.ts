export interface Action<Result extends GenericPayload> {
  exectute(payload: Result): Promise<void>;
}
