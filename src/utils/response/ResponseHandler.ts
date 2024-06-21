
/**
 * This can be improved upon, not defined well rn.
 *
 */
interface ResponseBuilderOptions<Result extends GenericPayload> {
  handler: (result: Result) => FunctionResult;
}

export class ResponseBuilder<ResultPayload extends GenericPayload> {
  constructor(private options: ResponseBuilderOptions<ResultPayload>) {}

  build() {
    return this.options.handler;
  }
}
