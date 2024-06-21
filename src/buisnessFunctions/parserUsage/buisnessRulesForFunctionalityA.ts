export const rules = {
  ruleA: "SUM($A, $B)",
  ruleB: "SUB($A, $B)",
};

export const getRule = <Payload extends GenericPayload>(payload: Payload) => {
  //check payload and determine which rule to return, more rules now ??
  if (payload.a == 1) {
    return rules.ruleA;
  } else {
    return rules.ruleB;
  }
};

// we can assume the payload keys will match the rule arguments. getRule would verify that
export const injectArguments = <Payload extends GenericPayload>(
  payload: Payload,
  rule: string
) => {
  //inject the payload into the rule as arugments, 
  //this is where its sketchy, this violates a few web secutiry rules (string injection)
  //i didn't think or find a better way to do this safley. 
  //Maybe theres a better way ? But its probably more work checking the payload
  //This is essentially the same as running eval() which is a big no no 
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
  //you can obviously sanatize the params down to the char, but like it doesnt feel safe still idk
  Object.keys(payload).forEach((key) => {
    rule.replace(`$${key}`, payload[key as keyof typeof payload] as string);
  });

  return rule;
};
