import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { RuleEngineEventManager } from "./ruleEngine/RuleEngineEventManager";
import { RequestBuilder } from "./request/RequestHandler";
import { ResponseBuilder } from "./response/ResponseHandler";

type AzureFunction = (
  request: HttpRequest,
  context: InvocationContext
) => FunctionResult;

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
export function createAzureFunction<Payload extends GenericPayload>(
  request: RequestBuilder<Payload>,
  ruleEngineManager: RuleEngineEventManager<any, any>,
  response: ResponseBuilder
): AzureFunction {
  const intakeFN = request.build();
  const ruleEngineFN = ruleEngineManager.build();
  const outakeFN = response.build();

  return async function (request, context) {
    try {
      const payload = intakeFN(request);
      await ruleEngineFN(payload);
      return outakeFN();
    } catch (e) {
      //maybe we need an error handler builder as well ?
      //Or check the settings of the buidlers to determine how to handle
      return {};
    }
  };
}
