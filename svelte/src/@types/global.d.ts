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
  login: (data: any) => any;
  onFocus: (callback: (event: any, value: any) => void) => void;
  onBlur: (callback: (event: any, value: any) => void) => void;
  isFocused: () => Promise<boolean>;
}

export declare interface ApiWindow extends Window {
  api: IElectronAPI;
  electron: IElectronWindowSystem;
}