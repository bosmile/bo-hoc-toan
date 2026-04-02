const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const loadURL = serve({ directory: path.join(__dirname, 'out') });

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the next.js app from the out directory handled by electron-serve
  loadURL(mainWindow);
  
  // To avoid seeing standard Electron menus
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
