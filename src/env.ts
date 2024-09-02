import { configDotenv } from "dotenv";
configDotenv();

export default function <T>(name: string, fallback: T): T {
  const value = process.env[name];
  if (!value) return fallback;
  
  switch (typeof fallback) {
    case "number":
      return (parseInt(value) as any) as T;
    case "boolean":
      return (value === "true" as any) as T;
    default:
      return value as any as T;
  }
}

