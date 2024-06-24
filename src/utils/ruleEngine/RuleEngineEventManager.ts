import { InvocationContext } from "@azure/functions";
import { Engine } from "json-rules-engine";

type SubScriber<EventPayloads> = (
  data: EventPayloads,
  context: InvocationContext
) => Promise<void>;

export class RuleEngineEventManager<
  EventPayloads extends GenericPayload,
  EventNames extends string = string
> {
  subscribers: Map<EventNames, Array<SubScriber<EventPayloads>>> = new Map();

  constructor(private ruleEngine: Engine) {}

  subscribe(
    eventName: EventNames,
    subscriber: (
      result: EventPayloads,
      context: InvocationContext
    ) => Promise<void>
  ) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    const prevSub = this.subscribers.get(eventName) as Array<
      SubScriber<EventPayloads>
    >;

    prevSub.push(subscriber);

    return this;
  }

  build() {
    return async (payload: EventPayloads, context: InvocationContext) => {
      const { events } = await this.ruleEngine.run(payload);

      for (const event of events) {
        const subscribers = this.subscribers.get(event.type as EventNames);
        if (subscribers) {
          await Promise.all(
            subscribers.map((subscriber) =>
              subscriber(event.params as EventPayloads, context)
            )
          );
        }
      }
    };
  }
}
