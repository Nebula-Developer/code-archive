import fs from "fs";
import path from "path";
import type { TemplateConfig } from "./types";
import chalk from "chalk";
import ejs from "ejs";
import { errorClose } from "./error";

export async function scaffold(
  template: TemplateConfig,
  projectName: string,
  featureList: string[]
) {
  const templateRoot = path.dirname(template.path);
  const templateDir = path.join(
    templateRoot,
    template.contentFolder || "content"
  );

  if (!fs.existsSync(templateDir))
    errorClose(
      `Template content folder not found at ${templateDir}. Please check the template configuration.`
    );

  const projectDir = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectDir))
    errorClose(`Project directory already exists at ${projectDir}.`);

  console.log(chalk.green(`Creating project directory at ${projectDir}...`));
  fs.mkdirSync(projectDir, { recursive: true });

  console.log(chalk.green(`Copying template files from ${templateDir}...`));

  const copyDir = (src: string, dest: string) => {
    if (!fs.existsSync(src)) return;
    fs.readdirSync(src).forEach((file) => {
      let actualName = file;

      let featureMatch = /^\(([^)]+)\)/.exec(file);
      if (featureMatch) {
        const rawFeatures = featureMatch[1] || "";
        const features = rawFeatures.split(",").map((f) => f.trim());

        const excluded = features
          .filter((f) => f.startsWith("!"))
          .map((f) => f.slice(1));
        const required = features.filter((f) => !f.startsWith("!"));

        if (excluded.some((f) => featureList.includes(f))) {
          console.log(
            chalk.yellow(
              `Skipping ${file} as one of the excluded features is selected.`
            )
          );
          return;
        }

        if (!required.every((f) => featureList.includes(f))) {
          console.log(
            chalk.yellow(`Skipping ${file} as not all features are selected.`)
          );
          return;
        }

        actualName = actualName.replace(/^\([^)]+\)/, "").trim();
      }

      if (/^_/.test(actualName)) actualName = "." + actualName.slice(1);

      const srcFile = path.join(src, file);

      let destFile = path.join(dest, actualName);

      if (fs.statSync(srcFile).isDirectory()) {
        fs.mkdirSync(destFile, { recursive: true });
        copyDir(srcFile, destFile);
      } else {
        let ext = path.extname(file);
        if (ext === ".ejs") {
          const content = fs.readFileSync(srcFile, "utf-8");
          const rendered = ejs.render(
            content,
            {
              ...template,
              name: projectName,
              templateName: template.name,
              // boolean object for features
              // maps template.features to whether they are selected
              features: Object.fromEntries(
                Object.keys(template.features).map((key) => [
                  key,
                  featureList.includes(key),
                ])
              ),
            },
            {
              filename: srcFile,
              strict: false,
            }
          );
          fs.writeFileSync(destFile.replace(/\.ejs$/, ""), rendered);
          console.log(
            chalk.green(`Rendered ${destFile.replace(/\.ejs$/, "")}`)
          );
        } else {
          fs.copyFileSync(srcFile, destFile);
          console.log(chalk.green(`Copied ${destFile}`));
        }
      }
    });
  };

  copyDir(templateDir, projectDir);

  console.log(chalk.green("Template files copied successfully."));

  console.log("-".repeat(40));
  console.log(chalk.green("Project scaffolded successfully!"));
  console.log(chalk.green(`Run 'cd ${projectName}' to enter your project.`));
}
