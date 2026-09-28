const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');

let backendProcess;
let mainWindow;

const isDev = !app.isPackaged;

// Nombres comunes del servicio MySQL en Windows según la instalación
const MYSQL_SERVICE_NAMES = ['MySQL80', 'MySQL', 'MySQL57', 'MySQL84', 'mariadb', 'MariaDB'];

// Intenta arrancar el servicio MySQL de Windows si no está corriendo.
// Silencioso: no bloquea si falla (el backend mostrará el error de conexión).
function ensureMySQLRunning() {
  if (process.platform !== 'win32') return Promise.resolve();

  return new Promise((resolve) => {
    let index = 0;

    function tryNext() {
      if (index >= MYSQL_SERVICE_NAMES.length) {
        console.log('[MySQL] Ningún servicio conocido encontrado, continuando...');
        return resolve();
      }

      const name = MYSQL_SERVICE_NAMES[index++];
      exec(`net start "${name}"`, (err, stdout) => {
        if (!err) {
          console.log(`[MySQL] Servicio "${name}" iniciado.`);
          // Dar un momento para que MySQL esté listo para aceptar conexiones
          return setTimeout(resolve, 1500);
        }

        const msg = (stdout || '').toLowerCase();
        if (msg.includes('already') || msg.includes('ya se') || msg.includes('iniciado')) {
          console.log(`[MySQL] Servicio "${name}" ya estaba corriendo.`);
          return resolve();
        }

        // Este nombre de servicio no existe, probar el siguiente
        tryNext();
      });
    }

    tryNext();
  });
}

// Lee db.config.json si existe junto al ejecutable (permite cambiar contraseña sin recompilar)
function getDbConfig() {
  const configPath = isDev
    ? path.join(__dirname, '../backend/.env.json')
    : path.join(path.dirname(app.getPath('exe')), 'db.config.json');

  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (_) {}
  }
  return {};
}

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

    const dbConfig = getDbConfig();

    backendProcess = spawn(process.execPath, [backendPath], {
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: '1',
        PORT:       '3000',
        // Valores por defecto para localhost; el .env del backend los sobreescribe si existe
        DB_HOST:    dbConfig.DB_HOST    || process.env.DB_HOST    || 'localhost',
        DB_PORT:    dbConfig.DB_PORT    || process.env.DB_PORT    || '3306',
        DB_USER:    dbConfig.DB_USER    || process.env.DB_USER    || 'root',
        DB_PASS:    dbConfig.DB_PASS    || process.env.DB_PASS    || '',
        DB_NAME:    dbConfig.DB_NAME    || process.env.DB_NAME    || 'sistema_negocio',
        JWT_SECRET: dbConfig.JWT_SECRET || process.env.JWT_SECRET || 'sistema_negocio_secret'
      },
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
  await ensureMySQLRunning();
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