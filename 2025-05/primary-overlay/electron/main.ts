import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { Account, Client, OAuthProvider } from "appwrite";

// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createIntervalLerp(duration: number, callback: (progress: number) => void) {
  const start = Date.now();
  let cancelled = false;

  function tick() { 
    if (cancelled) return;

    const elapsed = Date.now() - start;
    let progress = elapsed / duration;

    if (progress >= 1 || cancelled) {
      callback(1);
      return;
    }

    callback(progress);
    setTimeout(tick, 16);
  }

  tick();

  return {
    cancel: () => {
      cancelled = true;
    },
    complete: () => {
      cancelled = true;
      callback(1);
    }
  };
}

async function makeOAuthWindow(url: string) {
  return new Promise((resolve) => {
    let resolved = false;

    const oauthWindow = new BrowserWindow({
      width: 800,
      height: 600,
      fullscreen: false,
      fullscreenable: false,
      x: 0,
      y: 0,
      webPreferences: {
        preload: path.join(__dirname, "preload.mjs"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    const safeResolve = (value: any) => {
      if (!resolved) {
        resolved = true;
        resolve(value);
      }
    };

    oauthWindow.once("closed", () => safeResolve(null));

    oauthWindow.webContents.on("will-redirect", (_, newUrl) => {
      console.log("Redirecting to:", newUrl);
      if (newUrl.startsWith("https://localhost")) {
        const urlParams = new URLSearchParams(new URL(newUrl).search);
        const secret = urlParams.get("secret");
        const userId = urlParams.get("userId");
        console.log("OAuth redirect params:", { secret, userId });

        if (secret && userId) {
          safeResolve({ secret, userId });
        } else {
          console.error("Invalid OAuth redirect URL:", newUrl);
          safeResolve(null);
        }

        oauthWindow.close();
      }
    });

    oauthWindow.webContents.once("did-fail-load", () => {
      // console.error("Failed to load OAuth URL.");
      // oauthWindow.close();
      // safeResolve(null);
    });

    try {
      console.log("Loading URL:", url);
      oauthWindow.loadURL(url);
    } catch (e) {
      console.error("Error loading OAuth URL:", e);
      oauthWindow.close();
      safeResolve(null);
    }
  });
}

function createWindow() {
  const screenDimensions = screen.getPrimaryDisplay().bounds;

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),

      contextIsolation: true,
      nodeIntegration: true,
    },

    x: 0,
    y: 0,

    width: screenDimensions.width,
    height: screenDimensions.height,

    skipTaskbar: true,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    transparent: true,
    hasShadow: false,
    roundedCorners: false,
    focusable: true,
    acceptFirstMouse: true,
    titleBarStyle: "hidden",
  });

  const { width, height, x, y } = screen.getPrimaryDisplay().bounds;
  win.setBounds({ x, y, width, height }, false);

  if (process.platform === "darwin") win.setHiddenInMissionControl(true);

  win.setVisibleOnAllWorkspaces(true);
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  win.setOpacity(1);
  win.setMenu(null);
  Menu.setApplicationMenu(null);
  win.removeMenu();

  win.webContents.openDevTools();

  if (process.platform === "darwin")
    app.dock.hide();

  const client = new Client();
  client.setEndpoint("https://app.nebuladev.net/v1").setProject("nebula");
  const account = new Account(client);

  let windowVisible = false;
  let allowOpening = true;

  function setWindow(state: boolean, sendSignal = true, grabFocus = true) {
    if (grabFocus) {
      win!.setIgnoreMouseEvents(!state, { forward: !state });
      state ? win!.focus() : win!.blur();
    }

    windowVisible = state;

    if (sendSignal) {
      win!.webContents.send("sidebar", state);
    }
  }

  function opacityTo(opacity: number, duration = 100) {
    let currentOpacity = win?.getOpacity() ?? 1;
    let opacityAnimation = createIntervalLerp(duration, (progress) => {
      if (!win) return;
      win.setOpacity(currentOpacity + (opacity - currentOpacity) * progress);
    });

    return opacityAnimation;
  }

  globalShortcut.register("CommandOrControl+Shift+D", () => {
    if (!allowOpening) return;
    setWindow(!windowVisible);
  });

  globalShortcut.register("CommandOrControl+Shift+G", () => {
    if (!allowOpening) return;
    setWindow(!windowVisible, true, false);
  });

  ipcMain.on("sidebar", (_, args) => {
    if (typeof args === "boolean") {
      setWindow(args);
    }
  });

  ipcMain.on("oauth", async (_, args) => {
    if (typeof args === "undefined") return;
    const provider = args as OAuthProvider;

    if (!provider || !Object.values(OAuthProvider).includes(provider)) {
      console.error("Invalid OAuth provider:", provider);
      return;
    }

    allowOpening = false;

    let opacity = win?.getOpacity() ?? 1;
    let opacityAnimation = opacityTo(0, 250);

    setWindow(false, false);

    try {
      const url = account.createOAuth2Token(provider, "https://localhost");
      console.log("OAuth URL:", url);

      const result = await makeOAuthWindow(url as string);

      opacityAnimation.cancel();
      opacityAnimation = opacityTo(opacity, 250);

      setWindow(true, false);

      win?.webContents.send("oauth", result ?? null);
      if (!result) console.error("OAuth window closed without redirect.");
    } catch (error) {
      console.error("Error creating OAuth session:", error);
    } finally {
      allowOpening = true;
    }
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//     win = null
//   }
// })

// app.on('activate', () => {
//   On OS X it's common to re-create a window in the app when the
//   dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })

app.whenReady().then(createWindow);
