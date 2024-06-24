import { InvocationContext } from "@azure/functions";
import { Engine } from "json-rules-engine";

type SubScriber<Data, EventPayloads> = (
  payload: Data,
  data: EventPayloads,
  context: InvocationContext
) => Promise<void>;

export class RuleEngineEventManager<
  Data extends Record<string, string>,
  EventPayloads extends GenericPayload,
  EventNames extends string = string
> {
  subscribers: Map<EventNames, Array<SubScriber<Data, EventPayloads>>> =
    new Map();

  constructor(private ruleEngine: Engine) {}

  subscribe(
    eventName: EventNames | Array<EventNames>,
    subscriber: SubScriber<Data, EventPayloads>
  ) {
    const addEvent = (evName: EventNames) => {
      if (!this.subscribers.has(evName)) {
        this.subscribers.set(evName, []);
      }
      const prevSub = this.subscribers.get(evName) as Array<
        SubScriber<Data, EventPayloads>
      >;

      prevSub.push(subscriber);

      return this;
    };

    if (Array.isArray(eventName)) {
      for (const name of eventName) {
        addEvent(name);
      }
    } else {
      addEvent(eventName);
    }
    return this;
  }

  build() {
    return async (payload: Data, context: InvocationContext) => {
      const { events } = await this.ruleEngine.run(payload);

      for (const event of events) {
        const subscribers = this.subscribers.get(event.type as EventNames);
        if (subscribers) {
          return await Promise.all(
            subscribers.map((subscriber) =>
              subscriber(payload, event.params as EventPayloads, context)
            )
          );
        }
      }
    };
  }
}
