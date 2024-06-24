import { app } from "@azure/functions";
import { createAzureFunction } from "../utils/createAzureFunction";
import { RequestBuilder } from "../utils/request/RequestHandler";
import { ResponseBuilder } from "../utils/response/ResponseHandler";
import { Engine } from "json-rules-engine";
import { RuleEngineEventManager } from "../utils/ruleEngine/RuleEngineEventManager";

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
    type: "addressChangeDetected",
    params: {
      message: "RequestType is AddressChange",
    },
  },
});

const readFromIntakeRuleManger = new RuleEngineEventManager(
  readFromIntakeEngine
).subscribe("addressChangeDetected", async (data) => {
    
});

type Payload = {};
type Result = {};

export const readfromIntakeFunction = createAzureFunction(
  new RequestBuilder({}),
  readFromIntakeRuleManger,
  new ResponseBuilder({
    async handler() {
      return {
        status: 200,
        body: "OK",
      };
    },
  })
);

app.http("test", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: readfromIntakeFunction,
});
