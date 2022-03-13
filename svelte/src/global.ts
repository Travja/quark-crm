interface IFileSystemAPI {
  send(arg0: string, arg1: any): void;

  receive(arg0: string, func: (arg0: any) => void): void;
}

interface IElectronAPI {
  fileSystem: IFileSystemAPI;
}

interface IElectronWindowSystem {
  close: () => void,
  minimize: () => void,
  maximize: () => void,
  showDevTools: () => void
}

declare interface Window {
  api: IElectronAPI;
  electron: IElectronWindowSystem;
}
