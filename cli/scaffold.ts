import fs from "fs";
import path from "path";
import type { TemplateConfig } from "./types";
import chalk from "chalk";
import ejs from "ejs";
import { errorClose } from "./error";
import { syncPackage } from "./package";

export async function scaffold(
  template: TemplateConfig,
  projectName: string,
  featureList: string[],
  dependencies: string[],
  scripts: Record<string, string>
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
      let featureMatch = /^\[([^\]]+)\]/.exec(file);
      if (featureMatch) {
        const features = featureMatch[1]
          ? featureMatch[1].split(",").map((f) => f.trim())
          : [];
        if (!features.every((f) => featureList.includes(f))) {
          console.log(
            chalk.yellow(`Skipping ${file} as not all features are selected.`)
          );
          return;
        }
      }

      const srcFile = path.join(src, file);

      // 👇 handle _filename → .filename renaming
      let actualName = file;
      if (/^_/.test(actualName)) {
        actualName = "." + actualName.slice(1);
      }

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
              ...Object.fromEntries(
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

  console.log(chalk.green("Syncing package.json..."));
  syncPackage(
    path.join(projectDir, "package.json"),
    projectName,
    dependencies,
    scripts
  );

  console.log("-".repeat(40));
  console.log(chalk.green("Project scaffolded successfully!"));
  console.log(chalk.green(`Run 'cd ${projectName}' to enter your project.`));
}
