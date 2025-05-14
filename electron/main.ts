import { app, BrowserWindow, globalShortcut, ipcMain, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

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
  
  function toggleWindow(toggle: boolean) {
    win!.setIgnoreMouseEvents(!toggle, { forward: !toggle });

    if (toggle) {
      win!.focus();
    } else {
      win!.blur();
    }
  }

  var toggle = false;
  globalShortcut.register("CommandOrControl+Alt+D", () => {
    toggle = !toggle;
    toggleWindow(toggle);
    win!.webContents.send("sidebar", toggle);
  });

  ipcMain.on("sidebar", (_, args) => {
    if (typeof args == "undefined") return;
    toggle = args;
    toggleWindow(args);
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
