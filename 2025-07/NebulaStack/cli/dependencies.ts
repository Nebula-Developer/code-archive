export function parseDep(dep: string): [string, string] {
  const at = dep.lastIndexOf("@");
  if (at > 0) return [dep.slice(0, at), dep.slice(at + 1)];
  return [dep, "latest"];
}
