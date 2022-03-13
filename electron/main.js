"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_window_1 = __importDefault(require("./base-window"));
const electron_1 = require("electron");
const file_system_1 = __importDefault(require("./ipc/file-system"));
const main_window_1 = __importDefault(require("./main-window"));
const developerOptions = {
    isInProduction: false,
    serveSvelteDev: true,
    buildSvelteDev: false,
    watchSvelteBuild: false // true when you want to watch build svelte
};
/*
  testing svelte side: isInProduction: false, serveSvelteDev: true, buildSvelteDev:false, watchSvelteBuild: false
  testing only electron side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:false, watchSvelteBuild: false
  testing both side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:true, watchSvelteBuild: true
*/
electron_1.app.disableHardwareAcceleration();
const windowSettings = {
    width: 854,
    height: 854,
    enableLoadingScreen: true
};
const navApi = {
    close: (window) => window.close(),
    maximize: (window) => window.window.maximize(),
    minimize: (window) => window.window.minimize(),
    showDevTools: (window, event) => {
        if (event.sender.isDevToolsOpened())
            event.sender.closeDevTools();
        else
            event.sender.openDevTools();
    }
};
let main;
let loginWindow = new base_window_1.default('/login', { width: 400, height: 600, title: 'Quark - Login', enableLoadingScreen: true }, developerOptions, {
    ...navApi,
    login: (window, event, args) => {
        //TODO Write login state to disk somewhere?
        main = new main_window_1.default('/', { ...windowSettings, title: 'QuarkCRM' }, developerOptions, navApi);
        main.onEvent.on('window-created', async () => {
            file_system_1.default.initIpcMain(electron_1.ipcMain, main.window);
            loginWindow.hide();
            loginWindow.close();
            main.show();
            //     updaterInfo.initAutoUpdater(autoUpdater, main.window);
            event.reply('login-state', { value: true });
        });
    }
});
loginWindow.onEvent.on('window-created', () => loginWindow.show());
try {
    require('electron-reloader')(module);
}
catch {
}
