const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const os = require('os');

let djangoProcess;
let socketProcess; // new
const PORT = 65534;

/* ---------------- CPU-AWARE WORKER CALC ---------------- */

function getGunicornWorkers() {
  const cores = os.availableParallelism
    ? os.availableParallelism()
    : os.cpus().length;

  const workers = Math.min((cores * 2) + 1, 8);

  console.log(`[Django] Cores detected: ${cores}`);
  console.log(`[Django] Gunicorn workers: ${workers}`);

  return workers;
}

/* ---------------- DJANGO STARTUP ---------------- */

function startDjango() {
  const backendDir = path.join(__dirname, '..', 'backend');
  const workers = getGunicornWorkers();

  djangoProcess = spawn(
    'gunicorn',
    [
      'backend.wsgi:application',
      '--workers', String(workers),
      '--bind', `127.0.0.1:${PORT}`,
      '--timeout', '120'
    ],
    {
      cwd: backendDir,
      shell: true,
      stdio: 'inherit'
    }
  );

  djangoProcess.on('exit', (code) => {
    console.log(`[Django] exited with code ${code}`);
  });
}

/* ---------------- WAIT UNTIL DJANGO IS UP ---------------- */

function waitForDjango(interval = 500) {
  return new Promise((resolve) => {
    const check = () => {
      http.get(`http://127.0.0.1:${PORT}/`, () => {
        resolve();
      }).on('error', () => {
        setTimeout(check, interval);
      });
    };
    check();
  });
}

/* ---------------- WINDOW ---------------- */

async function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.floor(width * 0.97),
    height: Math.floor(height * 0.8),
    minWidth: Math.floor(width * 0.9),
    minHeight: Math.floor(height * 0.9),
    backgroundColor: '#0a0a0f',
    show: false,
    frame: false,
    transparent: true,
    title: 'SDM',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  ipcMain.on('request-window-close', (event) => {
    const w = BrowserWindow.fromWebContents(event.sender);
    if (w) w.close();
  });

  ipcMain.on('request-window-min', (event) => {
    const w = BrowserWindow.fromWebContents(event.sender);
    if (w) w.minimize();
  });

  ipcMain.on('request-window-max', (event) => {
    const w = BrowserWindow.fromWebContents(event.sender);
    if (!w) return;
    w.isMaximized() ? w.unmaximize() : w.maximize();
  });

  win.on('focus', () => win.webContents.send('window-focus', true));
  win.on('blur', () => win.webContents.send('window-focus', false));

  win.center();

  await win.loadFile(path.join(__dirname, 'loading.html'));
  win.show();

  await waitForDjango();

  await win.loadURL(`http://127.0.0.1:${PORT}/`);
}

/* ---------------- APP LIFECYCLE ---------------- */

app.whenReady().then(() => {
  // --- Start Python socket server BEFORE Django ---
  const backendDir = path.join(__dirname, '..', 'backend');
  socketProcess = spawn('python3', ['sss.py'], {
    cwd: backendDir,
    shell: true,
    stdio: 'inherit'
  });

  socketProcess.on('exit', (code) => {
    console.log(`[SocketServer] exited with code ${code}`);
  });

  // --- Then start Django ---
  startDjango();

  // --- Then create window (loading.html intact) ---
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (djangoProcess) djangoProcess.kill();
  if (socketProcess) socketProcess.kill(); // kill socket server too
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  if (djangoProcess) djangoProcess.kill();
  if (socketProcess) socketProcess.kill();
});
