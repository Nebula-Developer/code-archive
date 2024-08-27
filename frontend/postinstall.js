import fs from "fs";
import path from "path";

const topDir = import.meta.dirname;

const fromPath = path.join(topDir, "node_modules", "tinymce");
const toPath = path.join(topDir, "public", "tinymce");

if (fs.existsSync(toPath))
  fs.rmSync(toPath, { recursive: true });

fs.cpSync(fromPath, toPath, { recursive: true });
