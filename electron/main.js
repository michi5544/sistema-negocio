const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess;
let mainWindow;

const isDev = !app.isPackaged;

function getBackendPath() {
  if (isDev) {
    return path.join(__dirname, '../backend/server.js');
  }
  return path.join(process.resourcesPath, 'backend/server.js');
}

function getFrontendPath() {
  if (isDev) {
    return path.join(__dirname, '../frontend/dist/index.html');
  }
  return path.join(process.resourcesPath, 'frontend/index.html');
}

function startBackend() {
  return new Promise((resolve) => {
    const backendPath = getBackendPath();

    backendProcess = spawn(process.execPath, [backendPath], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', PORT: '3000' },
      stdio: 'pipe',
      cwd: path.dirname(backendPath)
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`[Backend]: ${data}`);
      if (data.toString().includes('SERVER_READY')) {
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`[Backend Error]: ${data}`);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(getFrontendPath());
}

app.whenReady().then(async () => {
  await startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (backendProcess) backendProcess.kill();
});