import { HttpResponseInit, app } from "@azure/functions";
import { createAzureFunction } from "../utils/createAzureFunction";
import { RequestBuilder } from "../utils/request/RequestHandler";
import { Record } from "../database/models/Record";
import { Engine } from "json-rules-engine";
import { RuleEngineEventManager } from "../utils/ruleEngine/createRulesEngine";
import { ResponseBuilder } from "../utils/response/ResponseHandler";
import { QueueServiceClient } from "@azure/storage-queue";
import { z } from "zod";
import { createRulesEngine } from "../utils/ruleEngine/getRules";

enum State {
  Intake = "Intake",
  Processing = "Processing",
}

enum RequestType {
  AddressChange = "AddressChange",
}

const getHTTPTestRuleEngine = createRulesEngine("/HttpTestRules", true);

export const testHTTP = createAzureFunction(
  new RequestBuilder({
    type: "post",
    zodSantizer: new Map()
      .set("state", z.nativeEnum(State))
      .set("type", z.nativeEnum(RequestType)),
  }),
  getHTTPTestRuleEngine,
  new ResponseBuilder({
    async handler() {
      return {
        status: 200,
        body: "Done!",
      };
    },
  })
);

app.http("testADD", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: testHTTP,
});
