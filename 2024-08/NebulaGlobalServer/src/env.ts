import { configDotenv } from "dotenv";
import { resolve, join } from "path";

configDotenv({
  path: resolve(join(__dirname, "..", ".env")),
});

export const lenv = process.env;
for (const key in lenv) lenv[key.toLowerCase()] = lenv[key];

export default function <T>(name: string, fallback: T): T {
  const value = lenv[name];
  if (!value) return fallback;

  switch (typeof fallback) {
    case "number":
      return parseInt(value) as any as T;
    case "boolean":
      return (value === ("true" as any)) as T;
    default:
      return value as any as T;
  }
}
