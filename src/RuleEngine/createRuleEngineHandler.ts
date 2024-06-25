import { Engine } from "json-rules-engine";
import { RuleEngineEventManager } from "./utils/RulesEngineEventManager";
import { getRuleEngine } from "./utils/getRuleEngine";
import { HttpResponse } from "@azure/functions";

/**
 * Yes this has to be re-created all the time, but I like it.
 *
 */
export const createRuleEngineHandler = <
  ResponseType extends Promise<HttpResponse | void>
>(
  folderPath: string
) => {
  const ruleEngine = getRuleEngine(folderPath);

  return new RuleEngineEventManager(ruleEngine)
    .subscribe("sendToQueue", async (payload, eventData, context) => {
      return {} as HttpResponse;
    })
    .subscribe("addToMongo", async (payload, eventData, context) => {})
    .build<ResponseType>();
};
