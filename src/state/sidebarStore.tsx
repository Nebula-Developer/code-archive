
// import { ipcRenderer } from "electron";
import { atom } from "nanostores";

export const $sidebar = atom(false);

(window as any).ipcRenderer?.on("sidebar", (_: any, value: any) => {
    $sidebar.set(value);
    console.log("Sidebar toggled:", value);
});
