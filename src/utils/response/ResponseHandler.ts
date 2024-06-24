/**
 * This can be improved upon, not defined well rn.
 *
 */
interface ResponseBuilderOptions<Result> {
  handler: () => Promise<Result>;
}

export class ResponseBuilder<Result> {
  constructor(private options: ResponseBuilderOptions<Result>) {}

  build() {
    return this.options.handler;
  }
}
