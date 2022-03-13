import { DeveloperOptions } from './configureDev';
import BaseWindow from './base-window';
import { ApiOptions } from './types';

class MainWindow extends BaseWindow {
  constructor(pathUrl: string,
              settings: { [key: string]: any } | null = null,
              settingsDev: DeveloperOptions | null = null,
              ipcApi: ApiOptions | null = null) {
    super(pathUrl, settings, settingsDev, ipcApi);
  }
}

export default MainWindow;