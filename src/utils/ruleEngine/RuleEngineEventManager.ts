import { Engine } from "json-rules-engine";

type SubScribers<EventPayloads> = Array<
  (data: EventPayloads) => Promise<void>
>;

export class RuleEngineEventManager<
  EventPayloads extends GenericPayload,
  EventNames extends string = string
> {
  subscribers: Map<EventNames, SubScribers<EventPayloads>> = new Map();

  constructor(private ruleEngine: Engine) {}

  subscribe(
    eventName: EventNames,
    subscriber: (result: EventPayloads) => Promise<void>
  ) {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    const prevSub = this.subscribers.get(
      eventName
    ) as SubScribers<EventPayloads>;

    prevSub.push(subscriber);

    return this;
  }

  build() {
    return async (payload: EventPayloads) => {
      const { events } = await this.ruleEngine.run(payload);

      for (const event of events) {
        const subscribers = this.subscribers.get(event.type as EventNames);
        if (subscribers) {
          await Promise.all(
            subscribers.map((subscriber) =>
              subscriber(event.params as EventPayloads)
            )
          );
        }
      }
    };
  }
}
