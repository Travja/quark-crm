import BaseWindow from './base-window';
import { apiUrl, fileApi, navApi } from '../api';
import fetch from 'electron-fetch';
import { writeCredentials } from '../ipc/file-system';
import { screen } from 'electron';
import IpcMainEvent = Electron.IpcMainEvent;

const developerOptions = {
  isInProduction: false, // true if is in production
  serveSvelteDev: true, // true when you want to watch svelte
  buildSvelteDev: false, // true when you want to build svelte
  watchSvelteBuild: false // true when you want to watch build svelte
};

/*
  testing svelte side: isInProduction: false, serveSvelteDev: true, buildSvelteDev:false, watchSvelteBuild: false
  testing only electron side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:false, watchSvelteBuild: false
  testing both side: isInProduction: true, serveSvelteDev: false, buildSvelteDev:true, watchSvelteBuild: true
*/

const login = (myWindow: BaseWindow, event: IpcMainEvent, args: any) => {
  fetch(`${apiUrl}/auth/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from(args.username + ':' + args.password).toString('base64')
    }
  })
    .then((res: any) => res.json())
    .then((data: any) => {
      if (data.authorized) {
        writeCredentials({
          token: data.token,
          refreshToken: data.refreshToken
        }).then(() => console.log('Wrote credentials'));

        if (myWindow.window.title === 'Quark - Login') {
          let main: BaseWindow = createMainWindow(
            data.token,
            data.refreshToken
          );
          main.onLoad((base: BaseWindow) => {
            myWindow.hide();
            myWindow.close();
            base.show();
          });
        }
      }

      event.reply('login-state', {
        authorized: data.authorized,
        token: data.token,
        refreshToken: data.refreshToken,
        error:
          data.error && data.error.message ? data.error.message : data.error
      });
    })
    .catch((err: any) =>
      event.reply('login-state', {
        authorized: false,
        error: err.message
      })
    );
};

const logout = () => {
  writeCredentials({
    token: '',
    refreshToken: ''
  }).then(() => console.log('Wrote credentials'));
};

export const createMainWindow = (
  token: string,
  refreshToken: string
): BaseWindow => {
  return new BaseWindow(
    `?token=${token}&refreshToken=${refreshToken}`,
    {
      width: screen.getPrimaryDisplay().workAreaSize.width * 0.8,
      height: screen.getPrimaryDisplay().workAreaSize.height - 100,
      enableLoadingScreen: true,
      title: 'QuarkCRM'
    },
    developerOptions,
    {
      ...navApi,
      ...fileApi,
      login,
      logout
    }
  );
};

export const createLoginWindow = (): BaseWindow => {
  const loginWindow = new BaseWindow(
    '/login',
    {
      width: 400,
      height: 600,
      title: 'Quark - Login',
      enableLoadingScreen: true
    },
    developerOptions,
    {
      ...navApi,
      ...fileApi,
      login,
      logout
    }
  ).onLoad((window: BaseWindow) => {
    window.show();
    window.focus();
  });

  return loginWindow;
};
