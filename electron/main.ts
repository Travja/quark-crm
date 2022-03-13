import BaseWindow from './base-window';
import { ipcMain } from 'electron';
import fileSystem from './ipc/file-system';
import MainWindow from './main-window';
import { ApiOptions } from './types';

const developerOptions = {
  isInProduction: false,    // true if is in production
  serveSvelteDev: true,    // true when you want to watch svelte
  buildSvelteDev: false,     // true when you want to build svelte
  watchSvelteBuild: false   // true when you want to watch build svelte
};

/*
  testing svelte side: isInProduction: false, serveSvelteDev: true, buildSvelteDev:false, watchSvelteBuild: false
  testing only electron side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:false, watchSvelteBuild: false
  testing both side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:true, watchSvelteBuild: true
*/

const windowSettings = {
  width: 854,
  height: 854,
  enableLoadingScreen: true
};

const navApi: ApiOptions = {
  close: (window: BaseWindow) => window.close(),
  maximize: (window: BaseWindow) => window.window.maximize(),
  minimize: (window: BaseWindow) => window.window.minimize(),
  showDevTools: (window: BaseWindow, event) => event.sender.openDevTools()
};

let main = new MainWindow(
  '/',
  { ...windowSettings, title: 'QuarkCRM' },
  developerOptions,
  navApi
);
let loginWindow = new BaseWindow(
  '/login',
  { width: 400, height: 600, title: 'Quark - Login' },
  developerOptions,
  navApi
);

loginWindow.onEvent.on('window-created', () => loginWindow.show());

main.onEvent.on('window-created', async () => {
  fileSystem.initIpcMain(ipcMain, main.window);
//     updaterInfo.initAutoUpdater(autoUpdater, main.window);
});

try {
  require('electron-reloader')(module);
} catch {
}
