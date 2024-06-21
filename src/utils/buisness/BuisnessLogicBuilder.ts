import { Action } from "../action/Action";

export interface BuisnessLogicOptions<
  Payload extends GenericPayload,
  Result extends GenericPayload
> {
  /**
   *  Handler function that will be called when the buisness logic is triggered.
   *
   *  Can assume payload is safe and ts types match. Null and saftey checks preformed before
   *
   *  Can throw BuisnessLogicException depending on implemtation
   *
   */
  handler: (payload: Payload) => Result;

  /**
   *  If we need to do some action after the buisness logic is done, we can do it here.
   *
   */
  action?: Action<Result>;
}

/**
 *  Generic buisness logic builder class
 *
 *  For now the only property is a handler but I assume in the future there may be more
 */
export class BuisnessLogicBuilder<
  Payload extends GenericPayload,
  Result extends GenericPayload
> {
  constructor(private options: BuisnessLogicOptions<Payload, Result>) {}

  build() {
    return (payload: Payload): Result => {
      const result = this.options.handler(payload);
      if (this.options.action) {
        this.options.action.exectute(result);
      }
      return result;
    };
  }
}
