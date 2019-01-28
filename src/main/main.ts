import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { setMenu, openCloneRepoWindow, openInitRepoWindow, openOpenRepoWindow } from './menu';

// Live reloading
const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({strategy: 'react-hmr'});
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
  });

  // Set the menu
  setMenu(mainWindow);

  // Load the index.html of the app
  mainWindow.loadURL(`file://${__dirname}/../../assets/html/index.html`);

  // Open the DevTools
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Only show when the DOM is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow!.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (mainWindow === null) {
    createWindow();
  }
});

// Events

ipcMain.on('open-clone-repo-window', () => {
  if (mainWindow) {
    openCloneRepoWindow(mainWindow);
  }
});

ipcMain.on('open-init-repo-window', () => {
  if (mainWindow) {
    openInitRepoWindow(mainWindow);
  }
});

ipcMain.on('open-open-repo-window', () => {
  if (mainWindow) {
    openOpenRepoWindow(mainWindow);
  }
});