import BaseWindow from './base-window';
import { fileApi, navApi } from '../api';
import fetch from 'electron-fetch';
import IpcMainEvent = Electron.IpcMainEvent;

const mainWindowSettings = {
  width: 854,
  height: 854,
  enableLoadingScreen: true
};

const developerOptions = {
  isInProduction: false,    // true if is in production
  serveSvelteDev: true,    // true when you want to watch svelte
  buildSvelteDev: false,     // true when you want to build svelte
  watchSvelteBuild: false   // true when you want to watch build svelte
};

/*
  testing svelte side: isInProduction: false, serveSvelteDev: true, buildSvelteDev:false, watchSvelteBuild: false
  testing only electron side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:false, watchSvelteBuild: false
  testing both side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:true, watchSvelteBuild: true
*/

export const createMainWindow = (): BaseWindow => {
  return new BaseWindow(
    '/',
    { ...mainWindowSettings, title: 'QuarkCRM' },
    developerOptions,
    {
      ...navApi,
      ...fileApi
    }
  );
};

let main: BaseWindow = createMainWindow();
export const createLoginWindow = (): BaseWindow => {
  const loginWindow = new BaseWindow('/login',
    { width: 400, height: 600, title: 'Quark - Login', enableLoadingScreen: true },
    developerOptions,
    {
      ...navApi,
      ...fileApi,
      login: (window: BaseWindow, event: IpcMainEvent, args: any) => {
        //TODO Write login state to disk somewhere?

        console.log(args);
        console.log(args.username);

        fetch('http://localhost:8080/auth/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(args)
        })
          .then((res: any) => {
            console.log(res);
            return res.json();
          })
          .then((data: any) => {
            console.log(data);
            if (data.authorized) {
              main.onLoad((window: BaseWindow) => {
                // fileSystem.initIpcMain(ipcMain, main.window);
                loginWindow.hide();
                loginWindow.close();
                window.show();
                //updaterInfo.initAutoUpdater(autoUpdater, main.window);
              });

            }

            event.reply('login-state', {
              authorized: data.authorized,
              error: (data.error && data.error.message ? data.error.message : data.error)
            });
          })
          .catch((err: any) => {
            event.reply('login-state', { authorized: false, error: err.message });
          });
      }
    }
  ).onLoad((window: BaseWindow) => {
    console.log('Window loaded');
    window.show();
    window.focus();
    // setTimeout(
    // () => window.showDevConsole{ mode: 'detach' }),
    // 500);
  });

  return loginWindow;
};

