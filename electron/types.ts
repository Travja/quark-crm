import IpcMainEvent = Electron.IpcMainEvent;
import BaseWindow from './window/base-window';

export interface ApiOptions {
  [key: string]: (
    window: BaseWindow,
    event: IpcMainEvent,
    ...args: any[]
  ) => void;
}
