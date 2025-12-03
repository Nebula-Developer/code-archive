import { archive } from "./archive";
import { generateReadme } from "./generateReadme";

if (process.argv.includes("--readme") || process.argv.includes("-r")) {
  console.log("Generating README...");
  await generateReadme();
}
else await archive();
