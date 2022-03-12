interface IFileSystemAPI {
    send(arg0: string, arg1: any): void;

    receive(arg0: string, func: (arg0: any) => void): void;
}

interface IElectronAPI {
    fileSystem: IFileSystemAPI;
}

declare interface Window {
    api: IElectronAPI;
}