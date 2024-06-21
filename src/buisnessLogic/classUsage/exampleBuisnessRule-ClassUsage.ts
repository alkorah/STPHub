/**
 *  Example usage. CLASS TYPE. This is how I think it should be done
 *
 * A payload type coming from either an api trigger or queue trigger
 *
 * A result type that will be returned from the handler
 */

import { MongoAction } from "../../utils/action/mongo";
import { BuisnessLogicBuilder } from "../../utils/buisness/BuisnessLogicBuilder";
import { BuisnessLogicException } from "../../utils/buisness/BuisnessLogicException";

//for response builder
export type Payload = {
  a: string;
  b: number;
  c: number;
};

//some buisness rule results
type BuisnessRuleAResult = {
  d: number;
};
type BuissnessRuleBResult = {
  e: number;
};

//the result, can place this in response builder generic
export type Result = BuisnessRuleAResult | BuissnessRuleBResult;

export const exampleBuisnessRule = new BuisnessLogicBuilder<Payload, Result>({
  //the actual buisnes logic, seperated away from everything else
  handler(payload) {
    if (payload.a === "some rule that says I need buisness type A result") {
      return {
        d: payload.b + payload.c,
      };
    } else if (payload.a === "some rule that says I need buisness type B result") {
      return {
        e: payload.b - payload.c,
      };
    } else {
      throw new BuisnessLogicException("No rule matched");
    }
  },
  action: new MongoAction(),
});
