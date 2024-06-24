import { HttpResponseInit, app } from "@azure/functions";
import { createAzureFunction } from "../utils/createAzureFunction";
import { RequestBuilder } from "../utils/request/RequestHandler";
import { Record } from "../database/models/Record";
import { Engine } from "json-rules-engine";
import { RuleEngineEventManager } from "../utils/ruleEngine/RuleEngineEventManager";

const readFromIntakeEngine = new Engine()
  .addRule({
    conditions: {
      all: [
        {
          fact: "RequestType",
          operator: "equal",
          value: "AddressChange",
        },
        {
          fact: "State",
          operator: "equal",
          value: "Intake",
        },
      ],
    },
    event: {
      type: "addressChangeAccepted",
      params: {
        message: "RequestType is AddressChange",
      },
    },
  })
  .addRule({
    conditions: {
      all: [
        {
          fact: "RequestType",
          operator: "equal",
          value: "AddressChange",
        },
        {
          fact: "State",
          operator: "equal",
          value: "Processing",
        },
      ],
    },
    event: {
      type: "addressChangeExecuting",
      params: {
        message: "RequestType is AddressChange",
      },
    },
  });

const readFromIntakeRuleManger = new RuleEngineEventManager(
  readFromIntakeEngine
)
  .subscribe("addressChangeAccepted", async (payload, eventData, context) => {
    const newReq = new Record({
      state: "Processing",
      type: "AddressChange",
    });

    await newReq.save();
  })
  .subscribe(
    "addressChangeExecuting",
    async (payload, eventData, context) => {
        
    }
  );

export const readfromIntakeFunction = createAzureFunction<unknown>(
  new RequestBuilder({
    type: "queue",
  }),
  readFromIntakeRuleManger
);

app.storageQueue("ReadfromIntake", {
  queueName: "ins-address-change-intake-queue",
  connection: "AzureWebJobsStorage",
  handler: readfromIntakeFunction,
});
