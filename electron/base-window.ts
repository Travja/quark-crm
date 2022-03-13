import ConfigureDev, { DeveloperOptions } from './configureDev';

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { EventEmitter } from 'events';
import { ApiOptions } from './types';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import IpcMainEvent = Electron.IpcMainEvent;

const appName = 'QuarkCRM';

const defaultSettings = {
  title: appName,
  width: 854,
  height: 480,
  enableLoadingScreen: true
};

const defaultSettingsDev: DeveloperOptions = {
  isInProduction: true,    // true if is in production
  serveSvelteDev: false,    // true when you want to watch svelte
  buildSvelteDev: false,     // true when you want to build svelte
  watchSvelteBuild: false     // true when you want to watch build svelte
};

class BaseWindow {
  window!: BrowserWindow;
  settings: { [key: string]: any };
  onEvent: EventEmitter = new EventEmitter();
  settingsDev: DeveloperOptions;
  configDev: ConfigureDev;
  pathUrl: string;
  ipcApi: ApiOptions | null;

  constructor(pathUrl: string = '/',
              settings: { [key: string]: any } | null = null,
              settingsDev: DeveloperOptions | null = null,
              ipcApi: ApiOptions | null = null) {
    this.settings = settings ? { ...settings } : { ...defaultSettings };
    this.settingsDev = settingsDev ? { ...settingsDev } : { ...defaultSettingsDev };

    this.configDev = new ConfigureDev(this.settingsDev);
    this.pathUrl = pathUrl;
    this.ipcApi = ipcApi;

    if (!app.isReady()) {
      app.on('ready', async () => {
        if (this.settings.enableLoadingScreen) {
          let loading = new BrowserWindow({ show: false, frame: false, width: 300, height: 300, transparent: true });

          loading.once('show', async () => {
            this.window = await this.createWindow();
            this.onEvent.emit('window-created');
            loading.hide();
            loading.close();
          });

          const loc = path.join(__dirname, 'www', 'loading.html');
          await loading.loadURL(loc);
          loading.show();
        } else {
          this.window = await this.createWindow();
          this.onEvent.emit('window-created');
        }
      });
    } else {
      this.createWindow().then((window: BrowserWindow) => {
        this.window = window;
        this.onEvent.emit('window-created');
      });
    }

    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    if (ipcApi) {
      app.whenReady().then(() => {
        ipcMain.on('window', this.listener);
      });
    }
  }

  async createWindow() {
    let settings = { ...this.settings };
    app.name = appName;
    let window = new BrowserWindow(<BrowserWindowConstructorOptions>{
      ...settings,
      show: false, // false
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')
      }
      // transparent: true,
      // frame: false,
    });
    window.setMenu(null);
    console.log('Window: ' + JSON.stringify(window));

    if (this.configDev.isLocalHost()) {
      try {
        await window.loadURL('http://localhost:3000' + this.pathUrl);
      } catch (error) {
        console.log(`ERROR: window.loadURL("http://localhost:3000${this.pathUrl}");`);
        console.log(error);
      }
    } else if (this.configDev.isElectronServe()) {
      try {
        await this.configDev.loadURL(window);
      } catch (error) {
        console.log(`this.configDev.loadURL(window);`);
        console.log(error);
      }
    }

    return window;
  }

  onWindowAllClosed = () => {
    if (process.platform !== 'darwin')
      app.quit();
  };

  onActivate = () => {
    if (!this.window) {
      console.log('Active');
      this.createWindow().then(() => {
      });
    }
  };

  listener = (event: IpcMainEvent, args: any) => {
    if (!this.window || this.window.webContents != event.sender) return;

    event.preventDefault();
    const arg: string = typeof args == 'string' ? args : args.action;
    console.log(arg);
    if (this.ipcApi && this.ipcApi.hasOwnProperty(arg)) {
      this.ipcApi[arg](this, event, args);
    } else {
      console.error('ipcApi does not include ' + arg);
    }
  };

  show = () => this.window?.show();
  hide = () => this.window?.hide();
  close = () => {
    ipcMain.off('window', this.listener);
    this.window?.close();
  };

}

export default BaseWindow;