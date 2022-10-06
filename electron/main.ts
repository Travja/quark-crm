import { app, ipcMain } from 'electron';
import { createLoginWindow } from './window/windows';

app.disableHardwareAcceleration();

const loginWindow = createLoginWindow();