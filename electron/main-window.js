"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_window_1 = __importDefault(require("./base-window"));
class MainWindow extends base_window_1.default {
    constructor(pathUrl, settings = null, settingsDev = null, ipcApi = null) {
        super(pathUrl, settings, settingsDev, ipcApi);
    }
}
exports.default = MainWindow;
