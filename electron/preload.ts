import { contextBridge, ipcRenderer } from 'electron';

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: any) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

contextBridge.exposeInMainWorld('electron', {
  close: () => ipcRenderer.send('window', 'close'),
  minimize: () => ipcRenderer.send('window', 'minimize'),
  maximize: () => ipcRenderer.send('window', 'maximize'),
  showDevTools: () => ipcRenderer.send('window', 'showDevTools'),
  move: (x: number, y: number) => ipcRenderer.send('window', 'move', x, y),
  login: async (data: any) => {
    ipcRenderer.send('window', 'login', data);
    let result = await new Promise(resolve =>
      ipcRenderer.on('login-state',
        (event, args) => resolve(args))
    );

    return result;
  },
  isFocused: async () => {
    ipcRenderer.send('window', 'isFocused');
    let result = await new Promise(resolve =>
      ipcRenderer.on('focus-state',
        (event, args) => resolve(args))
    );

    return result;
  },
  onFocus: (callback: (event: any, value: any) => void) => ipcRenderer.on('focus', callback),
  onBlur: (callback: (event: any, value: any) => void) => ipcRenderer.on('blur', callback),
  isDarkTheme: async (callback: (event: any, value: any) => void) => {
    ipcRenderer.send('window', 'isDarkTheme');
    let result = await new Promise(resolve =>
      ipcRenderer.on('theme',
        (event, args) => resolve(args)
      )
    );

    return result;
  },
  writeCredentials: (data: { token: string, refreshToken: string }) => ipcRenderer.send('api', 'writeCredentials', data)
});

contextBridge.exposeInMainWorld('api', {
  saveFile: () => ipcRenderer.send('api', 'saveFile'),
  readFile: () => ipcRenderer.send('api', 'readFile')
});