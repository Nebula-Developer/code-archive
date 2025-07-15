import fs from "fs";
import chalk from "chalk";
import { parseDep } from "./dependencies";

export function extendPackage(
  packageJsonPath: string,
  projectName: string,
  dependencies: string[],
  scripts: Record<string, string>
): Record<string, any> | null {
  if (!fs.existsSync(packageJsonPath)) return null;

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf-8") as string
  );
  packageJson.name = projectName;
  packageJson.version = "1.0.0";

  packageJson.dependencies = {
    ...(packageJson.dependencies || {}),
    ...Object.fromEntries(dependencies.map(parseDep)),
  };

  packageJson.scripts = {
    ...(packageJson.scripts || {}),
    ...scripts,
  };

  return packageJson;
}

export function createPackage(
  projectName: string,
  dependencies: string[],
  scripts: Record<string, string>
): Record<string, any> {
  return {
    name: projectName,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      ...scripts,
    },
    dependencies: {
      ...Object.fromEntries(dependencies.map(parseDep)),
    },
    devDependencies: {},
    peerDependencies: {},
  };
}

export function syncPackage(
  path: string,
  projectName: string,
  dependencies: string[],
  scripts: Record<string, string>
) {
  let packageJson: object | null = {};
  let exists = fs.existsSync(path);
  if (exists) {
    console.log(chalk.green(`Extending existing package.json at ${path}...`));
    packageJson = extendPackage(path, projectName, dependencies, scripts);
  }

  if (!exists || !packageJson) {
    console.log(chalk.green(`Creating new package.json at ${path}...`));
    packageJson = createPackage(projectName, dependencies, scripts);
  }

  fs.writeFileSync(path, JSON.stringify(packageJson, null, 2));
}
