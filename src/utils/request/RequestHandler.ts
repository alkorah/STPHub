import { HttpRequest } from "@azure/functions";
import { QueueClient } from "@azure/storage-queue";

type Zod = {};

/**
 * This can be improved upon, not defined well rn.
 *
 */
interface RequestBuilderQueueOptions<Payload extends GenericPayload> {
  queueHandler?: (client: QueueClient) => Promise<void>;
}

interface RequestBuilderHTTPOptions<Payload extends GenericPayload> {
  zodSantizer: Map<keyof Payload, Zod>;
}

export class RequestBuilder<Payload extends GenericPayload> {
  constructor(
    private options:
      | RequestBuilderQueueOptions<Payload>
      | RequestBuilderHTTPOptions<Payload>
  ) {}

  // do the stuff to prepare payload, like either read from queue or sanatize http. This is not defined well rn
  build() {
    return (request: HttpRequest) => undefined as unknown as Payload;
  }
}
