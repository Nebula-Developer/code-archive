/**
 * Attempts to cast a string to the specified type.
 * @param str The string to cast.
 * @returns The casted value.
 */
export function castString(str: string, type: string): any | null {
  const lower = str.toLowerCase();
  switch (type) {
    case "number":
      return Number(str);
    case "boolean":
      return ["true", "1", "yes", "y"].includes(lower);
    case "string":
      return str;
    default:
      return null;
  }
}
