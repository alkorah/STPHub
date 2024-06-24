import { HttpRequest } from "@azure/functions";
import { QueueClient } from "@azure/storage-queue";

type Zod = {};

interface RequestBuilderHTTPOptions<Payload> {
  type: "http";
  zodSantizer: Map<keyof Payload, Zod>;
}

interface RequestBuilderQueueOptions {
  type: "queue";
}

export class RequestBuilder<Data> {
  constructor(
    private options:
      | RequestBuilderHTTPOptions<Data>
      | RequestBuilderQueueOptions
  ) {}

  // do the stuff to prepare payload, like either read from queue or sanatize http. This is not defined well rn
  build() {
    return (data: Data) => undefined as unknown as Data;
  }
}
