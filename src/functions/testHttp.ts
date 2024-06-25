import {
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  InvocationContext,
  app,
} from "@azure/functions";
import { createRuleEngineHandler } from "../RuleEngine/createRuleEngineHandler";
import { testHttpPayloadSanitizer } from "../zod/santizers";

const httpRuleEngineHandler =
  createRuleEngineHandler<Promise<HttpResponse>>("/HttpTestRules");

export async function testHTTP(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponse> {
  const data = testHttpPayloadSanitizer(await request.json());

  return httpRuleEngineHandler(data, context);
}

app.http("testADD", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: testHTTP,
});
