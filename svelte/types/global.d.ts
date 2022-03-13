interface IFileSystemAPI {
  send(arg0: string, arg1): void;

  receive(arg0: string, func: (arg0) => void): void;
}

interface IElectronAPI {
  fileSystem: IFileSystemAPI;
}

interface IElectronWindowSystem {
  close: () => void;
  minimize: () => void;
  maximize: () => void;
  showDevTools: () => void;
  login: () => any;
}

declare global {
  interface MyWindow {
    api: IElectronAPI;
    electron: IElectronWindowSystem;
  }
}

export {};
