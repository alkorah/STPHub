import { HttpResponseInit, app } from "@azure/functions";
import { createAzureFunction } from "../utils/createAzureFunction";
import { RequestBuilder } from "../utils/request/RequestHandler";
import { Record } from "../database/models/Record";
import { Engine } from "json-rules-engine";
import { RuleEngineEventManager } from "../utils/ruleEngine/RuleEngineEventManager";
import { ResponseBuilder } from "../utils/response/ResponseHandler";
import { QueueServiceClient } from "@azure/storage-queue";
import { z } from "zod";

enum State {
  Intake = "Intake",
  Processing = "Processing",
}

enum RequestType {
  AddressChange = "AddressChange",
}

const rules = new Engine().addRule({
  conditions: {
    any: [
      {
        fact: "SendTo",
        operator: "equal",
        value: "Queue",
      },
    ],
  },
  event: {
    type: "sendToQueueFromHTTP",
    params: {},
  },
});

const rulesManager = new RuleEngineEventManager(rules).subscribe(
  "sendToQueueFromHTTP",
  async (payload, eventData, context) => {
    context.log("EXEC sendToQueueFromHTTP");
    const queueClient = QueueServiceClient.fromConnectionString(
      process.env["AzureWebJobsStorage"] as string
    ).getQueueClient("ins-address-change-intake-queue");

    await queueClient.sendMessage(
      Buffer.from(JSON.stringify(payload)).toString("base64")
    );
  }
);

export const testHTTP = createAzureFunction(
  new RequestBuilder({
    type: "post",
    zodSantizer: new Map()
      .set("state", z.nativeEnum(State))
      .set("type", z.nativeEnum(RequestType)),
  }),
  rulesManager,
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
