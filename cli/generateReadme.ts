#!/usr/bin/env bun
import fs from "node:fs";
import { DATA_PATH, README_PATH } from "./paths";

function groupByYearMonth(repos: Array<{ createdAt: string }>) {
  const grouped: Record<string, Record<string, Array<any>>> = {};
  for (const r of repos) {
    const d = new Date(r.createdAt);
    const year = String(d.getFullYear());
    const month = d.toLocaleString("en-US", { month: "long" });

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(r);
  }
  return grouped;
}

export async function generateReadme() {
  if (!fs.existsSync(DATA_PATH)) return;

  const content = fs.readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(content || "{}");
  const repos = parsed.repos ?? [];

  const grouped = groupByYearMonth(repos);

  const stub = fs.readFileSync("./cli/README_STUB.md", "utf8");
  let out = stub + "\n\n";

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  for (const year of years) {
    out += `## ${year}\n\n`;

    const months = Object.keys(grouped[year] ?? {});
    const sortedMonths = months.sort(
      (a, b) =>
        new Date(`${b} 1`).getMonth() - new Date(`${a} 1`).getMonth()
    );

    for (const m of sortedMonths) {
      out += `### ${m}\n`;
      const list = grouped[year]?.[m] ?? [];
      for (const repo of list) {
        out += `- [${repo.name}](${repo.archivedPath}) - ${repo.description || "No description"}\n`;
      }
      out += "\n";
    }
  }

  // Ensure README directory exists (root always exists) and write
  fs.writeFileSync(README_PATH, out);
}
