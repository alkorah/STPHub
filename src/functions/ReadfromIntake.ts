import { HttpResponseInit, app } from "@azure/functions";
import { createAzureFunction } from "../utils/createAzureFunction";
import { RequestBuilder } from "../utils/request/RequestHandler";
import { ResponseBuilder } from "../utils/response/ResponseHandler";
import { Engine } from "json-rules-engine";
import { RuleEngineEventManager } from "../utils/ruleEngine/RuleEngineEventManager";
import { MongoAction } from "../utils/action/mongo";

const readFromIntakeEngine = new Engine().addRule({
  conditions: {
    all: [
      {
        fact: "RequestType",
        operator: "equal",
        value: "AddressChange",
      },
    ],
  },
  event: {
    type: "addressChange",
    params: {
      message: "RequestType is AddressChange",
    },
  },
});

const readFromIntakeRuleManger = new RuleEngineEventManager(
  readFromIntakeEngine
)
  .subscribe("addressChange", async (eventData, context) => {
    //send to IFast
    new MongoAction().exectute(eventData);
  })
  .subscribe("addressChange", async (eventData, context) => {
    //send to AWD
  });

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
