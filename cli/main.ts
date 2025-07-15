import { input, select, checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { scaffold } from "./scaffold";
import { getTemplates } from "./template";
import path from "path";
import fs from "fs";

export async function main() {
  const templates = getTemplates();

  const templateChoiceMap = templates.map((t, i) => ({
    name: t.name + (t.description ? ` - ${t.description}` : ""),
    value: i,
    
  }));

  const projectName = await input({
    message: "Enter project name",
    default: path.basename(process.cwd()).toLowerCase(),
    validate: (input) => {
      if (!input.trim()) return "Project name cannot be empty";
      if (!/^[a-z0-9-_]+$/.test(input))
        return "Project name can only contain lowercase alphanumeric characters, dashes, and underscores";
      const inputPath = path.join(process.cwd(), input);
      if (fs.existsSync(input)) return "Project name already exists";
      return true;
    },
  });

  const selectedTemplateIndex = await select({
    message: "Select template to scaffold",
    choices: templateChoiceMap,
  });

  if (
    selectedTemplateIndex === null ||
    selectedTemplateIndex >= templates.length
  ) {
    console.log(chalk.yellow("No template selected, exiting..."));
    return;
  }

  const template = templates[selectedTemplateIndex]!;

  const featureChoices = Object.entries(template.features).map(
    ([name, feature]) => ({
      name: feature.name + ` (${name})`,
      value: {
        id: name,
        ...feature,
      },
      checked: feature.default,
    })
  );

  const selectedFeatures = await checkbox({
    message: "Select features to include",
    choices: featureChoices,
    instructions: true,
    theme: {
      helpMode: "always",
    },
  });

  console.log("-".repeat(40));

  console.log(chalk.green(`Scaffolding project '${projectName}'...`));

  await scaffold(
    template,
    projectName,
    selectedFeatures.map((f) => f.id)
  );
}
