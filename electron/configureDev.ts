import { exec } from 'child_process';
import { loadURL } from './main.js';
import { apiUrl } from './api.js';

export interface DeveloperOptions {
  isInProduction: boolean;
  serveSvelteDev: boolean;
  buildSvelteDev: boolean;
  watchSvelteBuild: boolean;
}

class ConfigureDev {
  isInProduction: boolean;
  serveSvelteDev: boolean;
  buildSvelteDev: boolean;
  watchSvelteBuild: boolean;
  loadURL: any;

  constructor(settings: DeveloperOptions) {
    this.isInProduction = settings.isInProduction;
    this.serveSvelteDev = settings.serveSvelteDev;
    this.buildSvelteDev = settings.buildSvelteDev;
    this.watchSvelteBuild = settings.watchSvelteBuild;
    this.loadURL = null;

    this._check_isInProduction();

    if (!this.isInProduction && this.serveSvelteDev) this._dev_Svelte();
    if (!this.isInProduction && this.buildSvelteDev) this._build_Dist();
    if (!this.isInProduction && this.watchSvelteBuild) this._watch_Dist();
    if (this.isInProduction || !this.serveSvelteDev) this._serve_Dist();
  }

  _check_isInProduction() {
    if (!this.isInProduction) {
      this.isInProduction =
        process.env.NODE_ENV === 'production' ||
        !/[\\/]electron/.exec(process.execPath); // !process.execPath.match(/[\\/]electron/);

      if (this.isInProduction) {
        this.serveSvelteDev = false;
        this.buildSvelteDev = false;
        this.watchSvelteBuild = false;
      } else {
        console.log("We're in development mode");
      }
    } else {
      console.log("We're in development mode");
    }

    console.log('API URL:', apiUrl);
  }

  _dev_Svelte() {
    exec('npm run svelte:dev');
  }

  _build_Dist() {
    exec('npm run svelte:build');
  }

  _watch_Dist() {}

  _serve_Dist() {
    this.loadURL = loadURL;
  }

  isLocalHost() {
    return this.serveSvelteDev;
  }

  isElectronServe() {
    return !this.serveSvelteDev;
  }
}

export default ConfigureDev;
