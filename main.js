const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let downloadProgress = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  setInterval(() => {
    if (!downloadProgress) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  }, 10000)
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  downloadProgress = true;
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  downloadProgress = false;
  mainWindow.webContents.send('update_downloaded');
  autoUpdater.quitAndInstall(true, true);
  // app.relaunch();
});

ipcMain.on('restart_app', () => {

});
