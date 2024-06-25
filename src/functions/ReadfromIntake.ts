import { HttpResponseInit, InvocationContext, app } from "@azure/functions";
import { readFromIntakePayloadSanitizer } from "../zod/santizers";
import { createRuleEngineHandler } from "../RuleEngine/createRuleEngineHandler";

const ruleEngineHandler = createRuleEngineHandler("/readFromIntakeRules");

export async function ReadfromIntake(
  payload: unknown,
  context: InvocationContext
) {
  context.log("ReadfromIntake");
  const intakePayload = readFromIntakePayloadSanitizer(payload);

  await ruleEngineHandler(intakePayload, context);
}

app.storageQueue("ReadfromIntake", {
  queueName: "ins-address-change-intake-queue",
  connection: "AzureWebJobsStorage",
  handler: ReadfromIntake,
});
