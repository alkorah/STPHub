import { app } from "@azure/functions";
import { createAzureFunction } from "../utils/createAzureFunction";
import { RequestBuilder } from "../utils/request/RequestHandler";
import { ResponseBuilder } from "../utils/response/ResponseHandler";
import {
  Payload,
  Result,
  buisnessRulesForFunctionalityA,
} from "../buisnessFunctions/functionUsage/buisnessRulesForFunctionalityA";

export const exampleHTTPBuisnessLogicFunctionA = createAzureFunction(
  new RequestBuilder<Payload>({
    zodSantizer: new Map(), //soemthing like that if its http, will look different for queue
  }),
  buisnessRulesForFunctionalityA,
  new ResponseBuilder<Result>({
    async handler(result) {
      //same here, result will be different if queue, goal should be to make these two conifurable to either
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
  handler: exampleHTTPBuisnessLogicFunctionA,
});
