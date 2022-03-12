import MainWindow from "./main-window";
import {ipcMain} from "electron";
import fileSystem from "./ipc/file-system";

const developerOptions = {
    isInProduction: false,    // true if is in production
    serveSvelteDev: true,    // true when you want to watch svelte
    buildSvelteDev: false,     // true when you want to build svelte
    watchSvelteBuild: false,   // true when you want to watch build svelte
};

/*
  testing svelte side: isInProduction: false, serveSvelteDev: true, buildSvelteDev:false, watchSvelteBuild: false
  testing only electron side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:false, watchSvelteBuild: false
  testing both side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:true, watchSvelteBuild: true
*/

const windowSettings = {
    title: "MEMENTO - SvelteKit, Electron, TypeScript",
    width: 854,
    height: 854
}

let main = new MainWindow(windowSettings, developerOptions);

main.onEvent.on("window-created", async () => {
    fileSystem.initIpcMain(ipcMain, main.window);

//     updaterInfo.initAutoUpdater(autoUpdater, main.window);
});

try {
    require('electron-reloader')(module);
} catch {
}
