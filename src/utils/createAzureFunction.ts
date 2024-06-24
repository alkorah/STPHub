import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  RuleEngineEventManager,
  createGenericRulesHandler,
} from "./ruleEngine/createRulesEngine";
import { RequestBuilder } from "./request/RequestHandler";
import { ResponseBuilder } from "./response/ResponseHandler";
import { Engine } from "json-rules-engine";
import { createRulesEngine } from "./ruleEngine/getRules";

export function createAzureFunction<Data, Result = undefined>(
  request: RequestBuilder<Data>,
  getEngine: () => Engine,
  response?: ResponseBuilder<Result>
): (data: Data, context: InvocationContext) => Promise<Result> {
  const intakeFN = request.build();

  const ruleEngineFN = createGenericRulesHandler(getEngine).build();

  let outakeFN = response ? response.build() : undefined;

  return async function (request, context): Promise<Result> {
    try {
      const payload = await intakeFN(request);
      await ruleEngineFN(payload, context);
      if (outakeFN) {
        return outakeFN();
      }
      return undefined as Result;
    } catch (e) {
      context.error(e);
      return undefined as Result;
    }
  };
}
