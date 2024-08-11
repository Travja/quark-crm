import { ApiOptions } from './types';
import BaseWindow from './window/base-window';
import { nativeTheme } from 'electron';
import { writeCredentials } from './ipc/file-system';

export const navApi: ApiOptions = {
  close: (window: BaseWindow) => window.close(),
  maximize: (window: BaseWindow) => {
    if (window.window.isMaximized())
      window.window.unmaximize();
    else
      window.window.maximize();
  },
  minimize: (window: BaseWindow) => window.window.minimize(),
  showDevTools: (window: BaseWindow, event) => {
    console.log('Clicked dev tools');
    if (event.sender.isDevToolsOpened())
      event.sender.closeDevTools();
    else
      event.sender.openDevTools();
  },
  isFocused: (window: BaseWindow, event) => {
    console.log('Window is focused? ' + window.window.isFocused());
    event.reply('focus-state', window.window.isFocused());
  },
  isDarkTheme: (window: BaseWindow, event) => {
    console.log('Is dark theme? ' + nativeTheme.shouldUseDarkColors);
    event.reply('theme', nativeTheme.shouldUseDarkColors);
  },
  move: (window: BaseWindow, event, ...args) => {
  }
};

export const fileApi: ApiOptions = {
  saveFile: (window: BaseWindow) => {
    // TODO Implement these
  },
  readFile: (window: BaseWindow) => {
    // TODO Implement these
  },
  writeCredentials: (window: BaseWindow, event, data) => writeCredentials(data)
};