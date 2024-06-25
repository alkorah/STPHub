import { HttpResponse, InvocationContext } from "@azure/functions";
import { Engine } from "json-rules-engine";

type SubScriber = (
  payload: AllPayloads,
  data: any,
  context: InvocationContext
) => Promise<HttpResponse | void>;

export class RuleEngineEventManager {
  subscribers: Map<string, SubScriber> = new Map();

  constructor(private ruleEngine: Engine) {}

  subscribe(eventName: string, subscriber: SubScriber) {
    this.subscribers.set(eventName, subscriber);

    return this;
  }

  build<ResponseType extends Promise<HttpResponse | void>>() {
    return async (
      payload: AllPayloads,
      context: InvocationContext
    ): Promise<ResponseType> => {
      const { events } = await this.ruleEngine.run(payload);

      for (const event of events) {
        const subscriber = this.subscribers.get(event.type as string);
        if (subscriber) {
          return subscriber(payload, event.params, context) as ResponseType;
        }
      }

      throw new Error(`no subsrciber for event`);
    };
  }
}
