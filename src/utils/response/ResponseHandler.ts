/**
 * This can be improved upon, not defined well rn.
 *
 */
interface ResponseBuilderOptions {
  handler: () => FunctionResult;
}

export class ResponseBuilder {
  constructor(private options: ResponseBuilderOptions) {}

  build() {
    return this.options.handler;
  }
}
