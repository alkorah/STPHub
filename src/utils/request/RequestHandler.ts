import {
  HttpRequest,
  HttpRequestBodyInit,
  HttpRequestInit,
} from "@azure/functions";
import { z } from "zod";

interface RequestBuilderHTTPOptions<Payload> {
  type: "post" | "get" | "put" | "delete";
  zodSantizer: Map<string, z.Schema>;
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

  sanatize(record: HttpRequestBodyInit) {
    Object.entries(record).forEach(([value, key]) => {
      const schema = (
        this.options as RequestBuilderHTTPOptions<Data>
      ).zodSantizer.get(key);
      if (schema) {
        schema.parse(record);
      }
    });
  }

  // do the stuff to prepare payload, like either read from queue or sanatize http. This is not defined well rn
  build() {
    return async (data: Data) => {
      console.log(data);
      if (this.options.type === "post") {
        const payload = JSON.parse(await (data as HttpRequest).text());

        this.sanatize(payload as HttpRequestBodyInit);

        return payload;
      }
      if (this.options.type === "queue") {
        return data;
      } else {
        return undefined;
      }
    };
  }
}
