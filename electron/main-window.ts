import ConfigureDev, {DeveloperOptions} from "./configureDev";

import {app, BrowserWindow} from 'electron';
import path from "path";
import {EventEmitter} from 'events';
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

const appName = "MEMENTO - SvelteKit, Electron, TypeScript";

const defaultSettings = {
    title: "MEMENTO - SvelteKit, Electron, TypeScript",
    width: 854,
    height: 480
}

const defaultSettingsDev: DeveloperOptions = {
    isInProduction: true,    // true if is in production
    serveSvelteDev: false,    // true when you want to watch svelte
    buildSvelteDev: false,     // true when you want to build svelte
    watchSvelteBuild: false,   // true when you want to watch build svelte
}

class MainWindow {
    window!: BrowserWindow;
    settings: { [key: string]: any };
    onEvent: EventEmitter = new EventEmitter();
    settingsDev: DeveloperOptions;
    configDev: ConfigureDev;

    constructor(settings: { [key: string]: any } | null = null, settingsDev: DeveloperOptions | null = null) {
        this.settings = settings ? {...settings} : {...defaultSettings};
        this.settingsDev = settingsDev ? {...settingsDev} : {...defaultSettingsDev};

        this.configDev = new ConfigureDev(this.settingsDev);

        app.on('ready', async () => {

            let loading = new BrowserWindow({show: false, frame: false, width: 300, height: 300, transparent: true})

            loading.once('show', async () => {
                this.window = await this.createWindow();
                this.onEvent.emit("window-created");
                loading.hide()
                loading.close()
            })
            const loc = path.join(__dirname, "www", "loading.html")
            await loading.loadURL(loc);
            loading.show();
        })

        app.on('window-all-closed', this.onWindowAllClosed);
        app.on('activate', this.onActivate);
    }

    async createWindow() {
        let settings = {...this.settings}
        app.name = appName;
        let window = new BrowserWindow(<BrowserWindowConstructorOptions>{
            ...settings,
            show: false, // false
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: true,
                preload: path.join(__dirname, "preload.js")
            }
        });
        console.log("Window: " + JSON.stringify(window));

        if (this.configDev.isLocalHost()) {
            try {
                await window.loadURL("http://localhost:3000/");
            } catch (error) {
                console.log(`ERROR: window.loadURL("http://localhost:3000/");`)
                console.log(error)
            }
        } else if (this.configDev.isElectronServe()) {
            try {
                await this.configDev.loadURL(window);
            } catch (error) {
                console.log(`this.configDev.loadURL(window);`)
                console.log(error)
            }
        }

        window.show();

        return window;
    }

    onWindowAllClosed = () => {
        if (process.platform !== 'darwin')
            app.quit();
    }

    onActivate = () => {
        if (!this.window)
            this.createWindow().then(() => {
            });
    }

}

export default MainWindow;