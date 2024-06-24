import { InvocationContext } from "@azure/functions";
import { QueueServiceClient } from "@azure/storage-queue";
import { Engine } from "json-rules-engine";
import { AddRecordToMongo, SendToNextQueue } from "./types";

type SubScriber<Data, EventPayloads> = (
  payload: Data,
  data: EventPayloads,
  context: InvocationContext
) => Promise<void>;

export class RuleEngineEventManager<
  Data extends Record<string, string>,
  EventPayloads extends SendToNextQueue | AddRecordToMongo,
  EventNames extends string = string
> {
  subscribers: Map<EventNames, Array<SubScriber<Data, EventPayloads>>> =
    new Map();

  constructor(private ruleEngine: () => Engine) {}

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
      const { events } = await this.ruleEngine().run(payload);

      for (const event of events) {
        const subscribers = this.subscribers.get(event.type as EventNames);
        if (subscribers) {
          return await Promise.all(
            subscribers.map((subscriber) => {
              context.log("EXEC: " + event.type);
              return subscriber(
                payload,
                event.params as EventPayloads,
                context
              );
            })
          );
        }
      }
    };
  }
}

//the handler is now generic accross all functions and rules.
export const createGenericRulesHandler = (getRules: () => Engine) =>
  new RuleEngineEventManager(getRules)
    .subscribe("sendToQueue", async (payload, eventData, context) => {
      context.log("EXEC send to queue event");
      const { staticValues, payloadKeys, queueName } =
        eventData as SendToNextQueue;

      const dataToStoreInQueue = {
        ...staticValues,
        ...payloadKeys.reduce((acc, key) => {
          acc[key] = payload[key];
          return acc;
        }, {} as Record<string, string>),
      };

      const queueClient = QueueServiceClient.fromConnectionString(
        process.env["AzureWebJobsStorage"] as string
      ).getQueueClient(queueName);

      await queueClient.sendMessage(
        Buffer.from(JSON.stringify(dataToStoreInQueue)).toString("base64")
      );
    })
    .subscribe("addToMongo", async (payload, eventData, context) => {});
