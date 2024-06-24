import fs from "fs";
import { Engine } from "json-rules-engine";
import path from "path";
import chokidar from "chokidar";

const getRulesEngine = (folderPath: string) => {
  const ruleEngine = new Engine();

  fs.readdirSync(folderPath).forEach((file: string) => {
    const rule = JSON.parse(fs.readFileSync(folderPath + "/" + file, "utf8"));

    ruleEngine.addRule(rule);
  });

  return ruleEngine;
};

export const createRulesEngine = (
  pathName: string,
  dev?: boolean
): (() => Engine) => {
  const folderPath = process.cwd() + "/rules" + pathName;

  let ruleEngine = getRulesEngine(folderPath);

  if (dev) {
    const watcher = chokidar.watch(folderPath);

    watcher.on("change", () => {
      try {
        let newRuleEngine = getRulesEngine(folderPath);
        ruleEngine = newRuleEngine;
        console.log("hot reloaded rules");
      } catch (e) {}
    });
  }

  return () => ruleEngine;
};
