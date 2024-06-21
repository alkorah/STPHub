import { BuisnessLogicBuilder } from "../../utils/buisness/BuisnessLogicBuilder";
import { Parser } from "hot-formula-parser";
import {
  getRule,
  injectArguments,
  rules,
} from "./buisnessRulesForFunctionalityA";

var parser = new Parser();

//how to define types ?
type Payload = {
  a: number;
  b: number;
};

type Result =
  | {
      c: number;
    }
  | {
      d: number;
    };

export const exampleBuisnessRuleWParser = new BuisnessLogicBuilder<
  Payload,
  Result
>({
  handler(payload) {
    //get the string rule
    const rule = getRule(payload);

    //inject arguments
    const ruleWPayload = injectArguments(payload, rule);

    //execute the rule
    const result = parser.parse(ruleWPayload);

    //return it
    return result.result as unknown as Result;
  },
});
