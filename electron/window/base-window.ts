import ConfigureDev, { DeveloperOptions } from '../configureDev';

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { EventEmitter } from 'events';
import { ApiOptions } from '../types';
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
  private loadCallback?: (window: BaseWindow) => void;
  private isLoaded = false;

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
      app.on('ready', async () => this.createWindow().then(this.loaded));
    } else {
      this.createWindow().then(this.loaded);
    }

    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    if (ipcApi) {
      app.whenReady().then(() => {
        console.log('Registering ipcMain');
        ipcMain.on('window', this.listener);
        ipcMain.on('api', this.apiListener);
      });
    }
  }

  private loaded = (window: BrowserWindow) => {
    this.window = window;
    console.log('Window created. Callback');
    this.isLoaded = true;
    this.loadCallback?.(this);
  };

  onLoad = (callback: (window: BaseWindow) => void): BaseWindow => {
    this.loadCallback = callback;
    if (this.isLoaded) {
      callback(this);
    }
    return this;
  };

  createWindow = async (): Promise<BrowserWindow> => {
    let settings: BrowserWindowConstructorOptions = {
      ...this.settings,
      show: false, // false
      titleBarStyle: 'hidden',
      webPreferences: {
        devTools: true,
        preload: path.join(app.getAppPath(), 'dist', 'preload.js')
      },
      icon: path.join(app.getAppPath(), 'dist', 'quark-logo.png')
    };
    // transparent: true,
    // frame: false,};
    app.name = appName;
    let window = new BrowserWindow(settings);
    window.setMenu(null);

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

    window.addListener('focus',
      () => window.webContents.send('focus'));
    window.addListener('blur',
      () => window.webContents.send('blur'));

    return window;
  };

  onWindowAllClosed = () => {
    if (process.platform !== 'darwin')
      app.quit();
  };

  onActivate = () => {
    if (!this.window) {
      console.log('Active');
      this.createWindow().then(this.loaded);
    }
  };

  listener = (event: IpcMainEvent, ...args: any[]) => {
    if (!this.window || this.window.webContents != event.sender) return;

    event.preventDefault();
    const action: string = typeof args == 'string' ? args : args[0];
    console.log('Event fired: ' + action);
    if (this.ipcApi && this.ipcApi.hasOwnProperty(action)) {
      args = args.slice(1);
      this.ipcApi[action](this, event, ...args);
    } else {
      console.error('ipcApi does not include ' + action);
    }
  };

  apiListener = (event: IpcMainEvent, ...args: any[]) => {
    if (!this.window || this.window.webContents != event.sender) return;

    event.preventDefault();
    const action: string = typeof args == 'string' ? args : args[0];
    console.log('API Event fired: ' + action);
    if (this.ipcApi && this.ipcApi.hasOwnProperty(action)) {
      args = args.slice(1);
      console.log(args);
      this.ipcApi[action](this, event, ...args);
    } else {
      console.error('ipcApi does not include ' + action);
    }
  };

  focus = () => this.window?.focus();
  show = () => this.window?.show();
  hide = () => this.window?.hide();
  close = () => {
    ipcMain.removeListener('window', this.listener);
    ipcMain.removeListener('api', this.apiListener);
    this.window?.close();
  };
  showDevConsole = (options?: Electron.OpenDevToolsOptions) => this.window?.webContents.openDevTools(options);

}

export default BaseWindow;