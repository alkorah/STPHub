import { HttpResponseInit, app } from "@azure/functions";
import { createAzureFunction } from "../utils/createAzureFunction";
import { RequestBuilder } from "../utils/request/RequestHandler";
import { Record } from "../database/models/Record";
import { Engine } from "json-rules-engine";
import {
  RuleEngineEventManager,
  createGenericRulesHandler,
} from "../utils/ruleEngine/createRulesEngine";
import { createRulesEngine } from "../utils/ruleEngine/getRules";

// a function that returns a rules engine, to make the rules engine hot reloadable
const getReadFromIntakeRulesEngine = createRulesEngine("/ReadFromIntakeRules", true);

export const ReadfromIntake = createAzureFunction<unknown>(
  new RequestBuilder({
    type: "queue",
  }),
  getReadFromIntakeRulesEngine
);

app.storageQueue("ReadfromIntake", {
  queueName: "ins-address-change-intake-queue",
  connection: "AzureWebJobsStorage",
  handler: ReadfromIntake,
});
