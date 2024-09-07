import { app, BrowserWindow } from 'electron';
import { createLoginWindow, createMainWindow } from './window/windows';
import { readCredentials, writeCredentials } from './ipc/file-system';
import fetch from 'electron-fetch';
import path from 'path';
import { serve } from './serve';
import { autoUpdater } from 'electron-updater';
import dialog = Electron.dialog;
import MessageBoxOptions = Electron.MessageBoxOptions;

export let installingUpdate = false;
export let loadURL = serve({ directory: './dist/www' });

app.disableHardwareAcceleration();

const showLoadingScreen = async () => {
  const loading = new BrowserWindow({
    show: false,
    frame: false,
    width: 300,
    height: 300,
    transparent: true
  });

  const loc = path.join(app.getAppPath(), 'dist', 'www', 'loading.html');
  await loading.loadFile(loc);
  loading.show();

  return loading;
};

app.on('ready', async () => {
  const loadingWindow = await showLoadingScreen();

  const credentials = readCredentials();
  credentials
    .then((data) => {
      if (!data) {
        createLoginWindow();
        loadingWindow.hide();
        loadingWindow.close();
        return;
      }

      // Check that the token hasn't expired yet
      // If it has and the refresh token is valid, refresh the token
      // If the refresh token is invalid, create a login window
      // If the token is still valid, create the main window

      const token = data.token;
      const refreshToken = data.refreshToken;

      // Check token expiration
      const jwt = token.split('.');
      if (jwt.length !== 3) {
        createLoginWindow();
        loadingWindow.hide();
        loadingWindow.close();
        return;
      }

      // Expired if 'exp' is less than current millis
      const payload = JSON.parse(atob(jwt[1]));
      const expiry = new Date((payload.exp || 0) * 1000);
      if (expiry < new Date()) {
        // Token expired
        // Check refresh token
        fetch(`${process.env.VITE_API_URL}/auth/refresh`, {
          method: 'post',
          headers: {
            Authorization: 'Bearer ' + refreshToken
          }
        })
          .then((res: any) => res.json())
          .then((data: any) => {
            if (data.token) {
              writeCredentials({
                token: data.token,
                refreshToken: data.refreshToken
              }).then(() => {
                createMainWindow(data.token, data.refreshToken).onLoad(
                  (base) => {
                    loadingWindow.hide();
                    loadingWindow.close();
                    base.show();
                  }
                );
              });
            } else {
              createLoginWindow();
              loadingWindow.hide();
              loadingWindow.close();
            }
          })
          .catch((_) => {
            createLoginWindow();
            loadingWindow.hide();
            loadingWindow.close();
          });
      } else {
        createMainWindow(token, refreshToken).onLoad((base) => {
          loadingWindow.hide();
          loadingWindow.close();
          base.show();

          autoUpdater.checkForUpdatesAndNotify().then((result) => console.log(result));
          autoUpdater.on('update-downloaded', (_) => {
            // Show dialog to user that there is an update
            const options = <MessageBoxOptions>{
              type: 'info',
              buttons: ['Restart', 'Later'],
              defaultId: 0,
              title: 'Update Available',
              message: 'A new update is available. Restart the application to apply the updates.',
            };

            dialog.showMessageBox(base.window, options).then((response) => {
              if (response.response === 0) { // 'Restart' button index
                installingUpdate = true;
                autoUpdater.quitAndInstall();
              }
            });
          });
        });
      }
    })
    .catch((_) => {
      createLoginWindow();
      loadingWindow.hide();
      loadingWindow.close();
    });
});
