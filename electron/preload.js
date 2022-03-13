"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_system_1 = __importDefault(require("./ipc/file-system"));
const contextBridge_1 = require("./ipc/General/contextBridge");
const electron_1 = require("electron");
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element)
            element.innerText = text;
    };
    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});
electron_1.contextBridge.exposeInMainWorld('electron', {
    close: () => electron_1.ipcRenderer.send('window', 'close'),
    minimize: () => electron_1.ipcRenderer.send('window', 'minimize'),
    maximize: () => electron_1.ipcRenderer.send('window', 'maximize'),
    showDevTools: () => electron_1.ipcRenderer.send('window', 'showDevTools'),
    login: async () => {
        electron_1.ipcRenderer.send('window', { action: 'login' });
        let result = await new Promise(resolve => electron_1.ipcRenderer.on('login-state', (event, args) => resolve(args)));
        return result;
    }
});
(0, contextBridge_1.generateContextBridge)([file_system_1.default]);
