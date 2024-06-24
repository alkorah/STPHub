export type Payload = {
  requestType: "addressChange" | "someOther";
};

type BuisnessRuleAResult = {
  d: number;
};


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
