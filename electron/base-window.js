"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configureDev_1 = __importDefault(require("./configureDev"));
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const events_1 = require("events");
const appName = 'QuarkCRM';
const defaultSettings = {
    title: appName,
    width: 854,
    height: 480,
    enableLoadingScreen: true
};
const defaultSettingsDev = {
    isInProduction: true,
    serveSvelteDev: false,
    buildSvelteDev: false,
    watchSvelteBuild: false // true when you want to watch build svelte
};
class BaseWindow {
    constructor(pathUrl = '/', settings = null, settingsDev = null, ipcApi = null) {
        this.onEvent = new events_1.EventEmitter();
        this.onWindowAllClosed = () => {
            if (process.platform !== 'darwin')
                electron_1.app.quit();
        };
        this.onActivate = () => {
            if (!this.window) {
                console.log('Active');
                this.createWindow().then(() => {
                });
            }
        };
        this.listener = (event, args) => {
            if (!this.window || this.window.webContents != event.sender)
                return;
            event.preventDefault();
            const arg = typeof args == 'string' ? args : args.action;
            console.log(arg);
            if (this.ipcApi && this.ipcApi.hasOwnProperty(arg)) {
                this.ipcApi[arg](this, event, args);
            }
            else {
                console.error('ipcApi does not include ' + arg);
            }
        };
        this.show = () => this.window?.show();
        this.hide = () => this.window?.hide();
        this.close = () => {
            electron_1.ipcMain.off('window', this.listener);
            this.window?.close();
        };
        this.settings = settings ? { ...settings } : { ...defaultSettings };
        this.settingsDev = settingsDev ? { ...settingsDev } : { ...defaultSettingsDev };
        this.configDev = new configureDev_1.default(this.settingsDev);
        this.pathUrl = pathUrl;
        this.ipcApi = ipcApi;
        if (!electron_1.app.isReady()) {
            electron_1.app.on('ready', async () => {
                if (this.settings.enableLoadingScreen) {
                    let loading = new electron_1.BrowserWindow({ show: false, frame: false, width: 300, height: 300, transparent: true });
                    loading.once('show', async () => {
                        this.window = await this.createWindow();
                        this.onEvent.emit('window-created');
                        loading.hide();
                        loading.close();
                    });
                    const loc = path_1.default.join(__dirname, 'www', 'loading.html');
                    await loading.loadURL(loc);
                    loading.show();
                }
                else {
                    this.window = await this.createWindow();
                    this.onEvent.emit('window-created');
                }
            });
        }
        else {
            this.createWindow().then((window) => {
                this.window = window;
                this.onEvent.emit('window-created');
            });
        }
        electron_1.app.on('window-all-closed', this.onWindowAllClosed);
        electron_1.app.on('activate', this.onActivate);
        if (ipcApi) {
            electron_1.app.whenReady().then(() => {
                electron_1.ipcMain.on('window', this.listener);
            });
        }
    }
    async createWindow() {
        let settings = { ...this.settings };
        electron_1.app.name = appName;
        let window = new electron_1.BrowserWindow({
            ...settings,
            show: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: true,
                preload: path_1.default.join(__dirname, 'preload.js')
            }
            // transparent: true,
            // frame: false,
        });
        window.setMenu(null);
        console.log('Window: ' + JSON.stringify(window));
        if (this.configDev.isLocalHost()) {
            try {
                await window.loadURL('http://localhost:3000' + this.pathUrl);
            }
            catch (error) {
                console.log(`ERROR: window.loadURL("http://localhost:3000${this.pathUrl}");`);
                console.log(error);
            }
        }
        else if (this.configDev.isElectronServe()) {
            try {
                await this.configDev.loadURL(window);
            }
            catch (error) {
                console.log(`this.configDev.loadURL(window);`);
                console.log(error);
            }
        }
        return window;
    }
}
exports.default = BaseWindow;
