import { MongoAction } from "../../utils/action/mongo";
import { BuisnessLogicBuilder } from "../../utils/buisness/BuisnessLogicBuilder";
import { BuisnessLogicException } from "../../utils/buisness/BuisnessLogicException";

//for response builder. Define what the buisness rules want as a payload and the types that it responds with
export type Payload = {
  a: string;
  b: number;
  c: number;
};

type BuisnessRuleAResult = {
  d: number;
};

type BuissnessRuleBResult = {
  e: number;
};

const rules = {
  ruleA: ({ b, c }: Payload): BuisnessRuleAResult => ({ d: b + c }),
  ruleB: ({ b, c }: Payload): BuissnessRuleBResult => ({ e: b - c }),
};

//the result, can place this in response builder generic
export type Result = BuisnessRuleAResult | BuissnessRuleBResult;

export const buisnessRulesForFunctionalityA = new BuisnessLogicBuilder<
  Payload,
  Result
>({
  //handler contains all buinsess logic.
  handler(payload) {
    //buisness rule 1
    if (payload.a === "rule A, returns type A result") {
      return rules.ruleA(payload);
    }
    //buisness rule 2
    else if (payload.a === "rule B, returns type B result") {
      return rules.ruleB(payload);
    } else {
      throw new BuisnessLogicException("No rule matched");
    }
  },
});
