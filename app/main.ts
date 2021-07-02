import { app, BrowserWindow, ipcMain, IpcMainEvent, Menu, Tray } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { TimeUpdateInterface } from '../src/app/shared/interfaces/time-update.interface';

// Initialize remote module
require('@electron/remote/main').initialize();

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  // Create the browser window.
  win = new BrowserWindow({
    title: 'Pomodoro APP',
    darkTheme: true,
    center: true,
    width: 800,
    height: 700,
    maxWidth: 800,
    maxHeight: 700,
    minWidth: 800,
    minHeight: 700,
    maximizable: false,
    skipTaskbar: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  win.removeMenu();

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${ __dirname }/../node_modules/electron`),
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true,
    }));

    // win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('close', (e: CloseEvent) => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    e.preventDefault();
    win.hide();
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  let tray: Tray | null = null;
  app.on('ready', () => {
    if (app.isPackaged) {
      tray = new Tray(path.join(process.resourcesPath, 'favicon.ico'));
    } else {
      tray = new Tray(path.join(__dirname, '../src/assets/icons/favicon.ico'));
    }
    initTray(tray);
    createWindow();

    win.focus();
    win.show();
  });

  // Quit when all windows are closed.
  win.on('closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      if (win)
        win.hide();
      else
        app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

/**
 * Inicia as tarefas da Tray
 */
function initTray(tray: Tray): void {
  const contextMenu = getUpdatedContextMenuTime(25, 0);

  tray.setToolTip('Pomodoro');

  tray.setContextMenu(contextMenu);
  setTrayListeners(tray, contextMenu);

  ipcMain.on('TIME_UPDATE', (event: IpcMainEvent, data: TimeUpdateInterface) => {
    const newContextMenu = getUpdatedContextMenuTime(data.minutes, data.seconds);

    tray.setContextMenu(newContextMenu);
    setTrayListeners(tray, newContextMenu);
  });

  ipcMain.on('TIME_DONE', (event, data: string) => {
    const newContextMenu = Menu.buildFromTemplate([
      { label: data, type: 'normal', icon: app.isPackaged ? path.join(process.resourcesPath, 'assets/icons/favicon.png') : path.join(__dirname, '../src/assets/icons/favicon.png') },
    ]);

    win.show();
    win.center();

    tray.setContextMenu(newContextMenu);
    tray.popUpContextMenu(newContextMenu, {
      x: tray.getBounds().x - tray.getBounds().width,
      y: tray.getBounds().y,
    });

    setTimeout(() => {
      tray.closeContextMenu();
    }, 2000);

    setTrayListeners(tray);
  });
}

/**
 * Atualiza e retorna um novo menu com tempo atualizado
 * @param minutes Os minutos
 * @param seconds Os segundos
 */
function getUpdatedContextMenuTime(minutes: number, seconds: number): Menu {
  return Menu.buildFromTemplate([
    { label: `${ minutes >= 10 ? minutes.toString() : `0${ minutes }` }: ${ seconds >= 10 ? seconds.toString() : `0${ seconds }` }`, type: 'normal' },
    {
      label: 'Quit', type: 'normal', role: 'close', click: () => {
        win.destroy();
      },
    },
  ]);
}

/**
 * Adiciona os listeners no Tray Icon
 */
function setTrayListeners(tray: Tray, menu?: Menu): void {
  tray.removeAllListeners();
  tray.on('click', () => win.show());
}
