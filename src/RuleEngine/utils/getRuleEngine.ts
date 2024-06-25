import fs from "fs";
import { Engine } from "json-rules-engine";

export const getRuleEngine = (pathName: string): Engine => {
  const folderPath = process.cwd() + "/rules" + pathName;

  const ruleEngine = new Engine();

  fs.readdirSync(folderPath).forEach((file: string) => {
    const rule = JSON.parse(fs.readFileSync(folderPath + "/" + file, "utf8"));

    ruleEngine.addRule(rule);
  });

  return ruleEngine;
};
