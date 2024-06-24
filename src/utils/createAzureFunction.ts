import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { RuleEngineEventManager } from "./ruleEngine/RuleEngineEventManager";
import { RequestBuilder } from "./request/RequestHandler";
import { ResponseBuilder } from "./response/ResponseHandler";

/*
 * Configured as a pipeline,
 * process the payload depenging on trigger and convert it into some generic data type the buisness logic can use.
 * Process the buisness logic with payload, and return the result or do some action (like db insert).
 * Convert the result into a response, depending on what the trigger was
 *
 *
 *
 *
 * Both intake and outtake should be configured generically to handle a queue event or http event.
 * So just putting settings on either will configure it.
 *
 * Add error handling as well
 *
 * I think the create function/builder pattern is best suited for the way azure functions has configued it for us/
 */
export function createAzureFunction<Data, Result = undefined>(
  request: RequestBuilder<Data>,
  ruleEngineManager: RuleEngineEventManager<any, any>,
  response?: ResponseBuilder<Result>
): (data: Data, context: InvocationContext) => Promise<Result> {
  const intakeFN = request.build();
  const ruleEngineFN = ruleEngineManager.build();

  let outakeFN = response ? response.build() : undefined;

  return async function (request, context): Promise<Result> {
    try {
      const payload = intakeFN(request);
      await ruleEngineFN(payload, context);
      if (outakeFN) {
        return outakeFN();
      }
      return undefined as Result;
    } catch (e) {
      //maybe we need an error handler builder as well ?
      //Or check the settings of the buidlers to determine how to handle
      return undefined as Result;
    }
  };
}
