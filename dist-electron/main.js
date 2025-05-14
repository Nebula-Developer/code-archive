import { app, screen, BrowserWindow, globalShortcut, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  const screenDimensions = screen.getPrimaryDisplay().bounds;
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: true
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
    titleBarStyle: "hidden"
  });
  const { width, height, x, y } = screen.getPrimaryDisplay().bounds;
  win.setBounds({ x, y, width, height }, false);
  if (process.platform === "darwin") win.setHiddenInMissionControl(true);
  win.setVisibleOnAllWorkspaces(true);
  win.setIgnoreMouseEvents(true, { forward: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  win.setOpacity(1);
  function toggleWindow(toggle2) {
    win.setIgnoreMouseEvents(!toggle2, { forward: !toggle2 });
    if (toggle2) {
      win.focus();
    } else {
      win.blur();
    }
  }
  var toggle = false;
  globalShortcut.register("CommandOrControl+Alt+D", () => {
    toggle = !toggle;
    toggleWindow(toggle);
    win.webContents.send("sidebar", toggle);
  });
  ipcMain.on("sidebar", (_, args) => {
    if (typeof args == "undefined") return;
    toggle = args;
    toggleWindow(args);
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
