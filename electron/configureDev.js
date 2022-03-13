"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const electron_serve_1 = __importDefault(require("electron-serve"));
class ConfigureDev {
    constructor(settings) {
        this.isInProduction = settings.isInProduction;
        this.serveSvelteDev = settings.serveSvelteDev;
        this.buildSvelteDev = settings.buildSvelteDev;
        this.watchSvelteBuild = settings.watchSvelteBuild;
        this.loadURL = null;
        this._check_isInProduction();
        if (!this.isInProduction && this.serveSvelteDev)
            this._dev_Svelte();
        if (!this.isInProduction && this.buildSvelteDev)
            this._build_Dist();
        if (!this.isInProduction && this.watchSvelteBuild)
            this._watch_Dist();
        if (this.isInProduction || !this.serveSvelteDev)
            this._serve_Dist();
    }
    _check_isInProduction() {
        if (!this.isInProduction) {
            this.isInProduction = process.env.NODE_ENV === 'production' || !/[\\/]electron/.exec(process.execPath); // !process.execPath.match(/[\\/]electron/);
        }
        ;
    }
    _dev_Svelte() {
        (0, child_process_1.exec)('npm run svelte:dev');
        require('electron-reload')(path_1.default.join(__dirname, '..', 'svelte'));
    }
    _build_Dist() {
        (0, child_process_1.exec)('npm run svelte:build');
    }
    _watch_Dist() {
        require('electron-reload')(path_1.default.join(__dirname, 'www'));
    }
    _serve_Dist() {
        this.loadURL = (0, electron_serve_1.default)({ directory: 'dist/www' });
    }
    isLocalHost() {
        return this.serveSvelteDev;
    }
    isElectronServe() {
        return !this.serveSvelteDev;
    }
}
exports.default = ConfigureDev;
