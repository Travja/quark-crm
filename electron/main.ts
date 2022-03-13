import BaseWindow from './base-window';
import { app, ipcMain } from 'electron';
import fileSystem from './ipc/file-system';
import MainWindow from './main-window';
import { ApiOptions } from './types';
import IpcMainEvent = Electron.IpcMainEvent;

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

app.disableHardwareAcceleration();

const windowSettings = {
  width: 854,
  height: 854,
  enableLoadingScreen: true
};

const navApi: ApiOptions = {
  close: (window: BaseWindow) => window.close(),
  maximize: (window: BaseWindow) => window.window.maximize(),
  minimize: (window: BaseWindow) => window.window.minimize(),
  showDevTools: (window: BaseWindow, event) => {
    if (event.sender.isDevToolsOpened())
      event.sender.closeDevTools();
    else
      event.sender.openDevTools();
  }
};

let main: MainWindow;
let loginWindow = new BaseWindow(
  '/login',
  { width: 400, height: 600, title: 'Quark - Login', enableLoadingScreen: true },
  developerOptions,
  {
    ...navApi,
    login: (window: BaseWindow, event: IpcMainEvent, args: any) => {

      //TODO Write login state to disk somewhere?

      main = new MainWindow(
        '/',
        { ...windowSettings, title: 'QuarkCRM' },
        developerOptions,
        navApi
      );
      main.onEvent.on('window-created', async () => {
        fileSystem.initIpcMain(ipcMain, main.window);
        loginWindow.hide();
        loginWindow.close();
        main.show();
//     updaterInfo.initAutoUpdater(autoUpdater, main.window);
        event.reply('login-state', { value: true });
      });
    }
  }
);

loginWindow.onEvent.on('window-created', () => loginWindow.show());

try {
  require('electron-reloader')(module);
} catch {
}
