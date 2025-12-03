#!/usr/bin/env bun
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { render, Box, Text, useInput, useApp, Newline } from "ink";
import color from "picocolors";
import { generateReadme } from "./generateReadme";
import { DATA_PATH, ROOT_PATH } from "./paths";

const DELETE_ENABLED = false; // toggle for testing

const asyncExec = (cmd: string) => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const process = spawn(cmd, { shell: true });
    let stdout = "";
    let stderr = "";
    process.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    process.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    process.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Command failed with code ${code}: ${stderr}`));
    });
  });
};

async function loadStore() {
  if (!fs.existsSync(DATA_PATH)) return { repos: [] };
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

async function saveStore(store: { repos?: any[] }) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

async function getBranch(dest: string) {
  try {
    await asyncExec(`git -C "${dest}" rev-parse --verify main`);
    return "main";
  } catch {}
  try {
    await asyncExec(`git -C "${dest}" rev-parse --verify master`);
    return "master";
  } catch {}
  return "main";
}

async function cloneRepo(url: string, prefix: string) {
  const tmpDir = path.join(process.cwd(), "_tmp", path.basename(prefix));
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  // Clone the repo temporarily (bare)
  await asyncExec(`git clone --bare "${url}" "${tmpDir}"`);

  // Ensure temp remote doesn't exist
  try {
    await asyncExec(`git -C "${ROOT_PATH}" remote remove temp`);
  } catch {} // ignore if it doesn't exist

  await asyncExec(`git -C "${ROOT_PATH}" remote add temp "${tmpDir}"`);
  await asyncExec(`git -C "${ROOT_PATH}" fetch temp`);

  // Make sure archive repo is clean before subtree add
  await asyncExec(`git -C "${ROOT_PATH}" add .`);
  await asyncExec(
    `git -C "${ROOT_PATH}" commit -m "Save progress before subtree add" || true`
  );

  // Detect main/master branch from temp
  const branch = await getBranch(tmpDir);

  // Add as subtree preserving history
  await asyncExec(
    `git -C "${ROOT_PATH}" subtree add --prefix="${prefix}" temp ${branch}`
  );

  // Remove temp remote
  await asyncExec(`git -C "${ROOT_PATH}" remote remove temp`);

  // Clean up temp folder
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

async function deleteRepo(name: string) {
  if (!DELETE_ENABLED) return;
  await asyncExec(`gh repo delete ${name} --yes`);
}

function TextInput({
  onSubmit,
  placeholder = "",
}: {
  onSubmit: (val: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  useInput((input, key) => {
    if (key.return) {
      onSubmit(value || placeholder);
    } else if (key.backspace || key.delete) {
      setValue((v) => v.slice(0, -1));
    } else {
      setValue((v) => v + input);
    }
  });
  return (
    <Text color="cyan">
      {value}
      {value.length === 0 && placeholder ? (
        <Text color="gray">{placeholder}</Text>
      ) : null}
    </Text>
  );
}

function App() {
  const { exit } = useApp();
  const [step, setStep] = useState<
    "username" | "fetching" | "processing" | "finishing" | "done"
  >("username");
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [activeTasks, setActiveTasks] = useState<Map<string, string>>(
    new Map()
  );
  const [log, setLog] = useState<string | null>(null);
  const logTimer = useRef<any>(null);
  const storeRef = useRef<{ repos: any[] }>({ repos: [] });

  const addLog = useCallback((msg: string) => {
    setLog(msg);
    if (logTimer.current) clearTimeout(logTimer.current);
    logTimer.current = setTimeout(() => setLog(null), 7000);
  }, []);

  useEffect(() => {
    loadStore().then((s) => {
      storeRef.current = s;
    });
  }, []);

  useEffect(() => {
    if (step === "fetching" && username) {
      (async () => {
        try {
          const { stdout } = await asyncExec(
            `gh repo list ${username} --json name,description,createdAt,url --limit 500`
          );
          const list = JSON.parse(stdout) ?? [];
          list.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Filter out repos that are already in the store
          const existingNames = new Set(
            storeRef.current.repos.map((r: any) => r.name)
          );
          const newRepos = list.filter((r: any) => !existingNames.has(r.name));

          setRepos(newRepos);
          setStep("processing");
        } catch (err) {
          addLog(`Error fetching repos: ${err}`);
          exit();
        }
      })();
    }
  }, [step, username]);

  useEffect(() => {
    if (
      step === "processing" &&
      index >= repos.length &&
      activeTasks.size === 0
    ) {
      setStep("finishing");
    }
  }, [index, activeTasks.size, step, repos.length]);

  useEffect(() => {
    if (step === "finishing") {
      (async () => {
        try {
          addLog("Saving store...");
          await saveStore(storeRef.current);
          addLog("Generating README...");
          await generateReadme();
        } catch (err) {
          addLog(`Error: ${err}`);
        } finally {
          setStep("done");
          exit();
        }
      })();
    }
  }, [step]);

  useInput((input, _) => {
    if (step !== "processing") return;
    if (index >= repos.length) return;

    const repo = repos[index];
    const next = () => setIndex((i) => i + 1);

    if (input === "a") {
      // Archive
      const created = new Date(repo.createdAt);
      const year = created.getFullYear();
      const month = String(created.getMonth() + 1).padStart(2, "0");
      const folder = path.join(ROOT_PATH, `${year}-${month}`);
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

      // Make prefix relative to archive repo root
      const relFolder = path.relative(ROOT_PATH, folder);
      const prefix = path.join(relFolder, repo.name);

      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

      setActiveTasks((prev) => new Map(prev).set(repo.name, "Cloning..."));

      (async () => {
        try {
          // Use new subtree-aware cloneRepo
          await cloneRepo(repo.url, prefix);

          storeRef.current.repos.push({
            name: repo.name,
            description: repo.description ?? "",
            createdAt: repo.createdAt,
            archivedPath: path.relative(process.cwd(), prefix),
            originalUrl: repo.url,
          });
          await saveStore(storeRef.current);

          setActiveTasks((prev) => new Map(prev).set(repo.name, "Deleting..."));
          await deleteRepo(`${username}/${repo.name}`);
        } catch (err) {
          addLog(`Failed ${repo.name}: ${err}`);
        } finally {
          setActiveTasks((prev) => {
            const next = new Map(prev);
            next.delete(repo.name);
            return next;
          });
        }
      })();
      next();
    } else if (input === "d") {
      // Delete
      setActiveTasks((prev) => new Map(prev).set(repo.name, "Deleting..."));
      (async () => {
        try {
          await deleteRepo(`${username}/${repo.name}`);
        } catch (err) {
          addLog(`Failed delete ${repo.name}: ${err}`);
        } finally {
          setActiveTasks((prev) => {
            const next = new Map(prev);
            next.delete(repo.name);
            return next;
          });
        }
      })();
      next();
    } else if (input === "q") setStep("finishing");
    else if (input === "i") next();
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="magenta" bold>
        repo-archiver
      </Text>
      <Newline />

      {step === "username" && (
        <Box>
          <Text>GitHub username: </Text>
          <TextInput
            onSubmit={(val) => {
              setUsername(val);
              setStep("fetching");
            }}
            placeholder="nebula-developer"
          />
        </Box>
      )}

      {step === "fetching" && (
        <Text color="yellow">Fetching repositories...</Text>
      )}

      {(step === "processing" || step === "finishing" || step === "done") && (
        <>
          <Box flexDirection="column" marginBottom={1}>
            <Text bold>Active Tasks ({activeTasks.size})</Text>
            {Array.from(activeTasks.entries()).map(([name, status]) => (
              <Text key={name}>
                {" "}
                {color.cyan(name)}: {status}
              </Text>
            ))}
            {activeTasks.size === 0 && (
              <Text color="gray"> No active tasks</Text>
            )}
          </Box>

          {step === "processing" && index < repos.length && (
            <Box
              flexDirection="column"
              borderStyle="round"
              borderColor="blue"
              padding={1}
            >
              <Text>Current Repo: {color.green(repos[index].name)}</Text>
              <Text color="gray">{repos[index].url}</Text>
              <Text>{repos[index].description}</Text>
              <Newline />
              <Text>
                Action? ({color.bold("a")}rchive / {color.bold("i")}gnore /{" "}
                {color.bold("d")}elete / {color.bold("q")}uit)
              </Text>
            </Box>
          )}

          {step === "finishing" && <Text color="green">Finishing up...</Text>}
          {step === "done" && (
            <Text color="green" bold>
              All done!
            </Text>
          )}

          {log && (
            <Box marginTop={1}>
              <Text color="yellow">{log}</Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export async function archive() {
  const { waitUntilExit } = render(<App />);
  await waitUntilExit();
}
