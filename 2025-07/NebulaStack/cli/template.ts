import fs from "fs";
import path from "path";
import chalk from "chalk";
import type { Template, TemplateConfig } from "./types";
import { errorClose } from "./error";

function findTemplatesDir(maxLevels = 3): string | null {
  let currentDir = __dirname;
  for (let i = 0; i <= maxLevels; i++) {
    const potential = path.join(currentDir, "templates");
    if (fs.existsSync(potential)) return potential;
    currentDir = path.resolve(currentDir, "..");
  }
  return null;
}

export function getTemplates(): TemplateConfig[] {
  const templatesDir = findTemplatesDir();
  if (!templatesDir)
    errorClose(
      "Templates directory not found in current or parent directories."
    );

  const templateDirs = fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (templateDirs.length === 0)
    errorClose("No templates found in the templates directory.");

  const templates: TemplateConfig[] = [];
  for (const dir of templateDirs) {
    const templatePath = path.join(templatesDir, dir, "template.json");
    if (!fs.existsSync(templatePath)) {
      console.warn(
        chalk.yellow(
          `Template directory '${dir}' does not have a template.json file.`
        )
      );
      continue;
    }

    try {
      const templateData = fs.readFileSync(templatePath, "utf-8");
      const template: Template = JSON.parse(templateData);
      templates.push({
        ...template,
        path: templatePath,
      } as TemplateConfig);
    } catch (error) {
      console.error(
        chalk.red(
          `Error reading template directory '${dir}': ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      );
    }
  }

  if (templates.length === 0) errorClose("No valid templates found.");

  templates.sort((a, b) => a.name.localeCompare(b.name));
  return templates;
}
