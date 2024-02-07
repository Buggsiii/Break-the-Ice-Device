/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { usb } from 'usb';
import { SerialPort, ReadlineParser } from 'serialport';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    autoHideMenuBar: true,
    fullscreen: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('did-finish-load', async () => {
    console.log('did-finish-load');

    let portList: string[] = [];

    await SerialPort.list()
      .then((ports) => {
        portList = ports
          .filter((port) => port.manufacturer === 'Silicon Labs')
          .map((port) => port.path);
      })
      .catch(console.log);
    console.log(portList);

    const ports: SerialPort[] = [];

    for (let i = 0; i < portList.length; i += 1) {
      ports.push(
        new SerialPort({
          path: portList[i],
          autoOpen: false,
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
        }),
      );
    }

    usb.on('attach', () => {
      if (!ports[0]) return;
      if (ports[0].isOpen) {
        ports[0].close((err) => {
          if (err) {
            console.log('Error closing port: ', err.message);
            return;
          }

          console.log('Port closed');
        });
      }
      ports[0].open((err) => {
        if (err) {
          console.log('Error opening port: ', err.message);
          return;
        }

        console.log('Port reopened');
        mainWindow?.webContents.send('one', 'connected');
      });
    });

    if (!ports[0]) return;
    ipcMain.on('one', (event, arg) => {
      if (arg !== 'ready') return;
      if (!ports[0].isOpen) return;
      event.reply('one', 'connected');
    });

    ports[0].open((err) => {
      if (err) {
        console.log('Error opening port: ', err.message);
        return;
      }

      console.log('Port opened');
      mainWindow?.webContents.send('one', 'connected');
    });

    ports[0].on('close', () => {
      console.log('Port closed. Attempting to reopen...');
      mainWindow?.webContents.send('one', 'disconnected');
      ports[0].open((err) => {
        if (err) {
          console.log('Error opening port: ', err.message);
          return;
        }

        console.log('Port reopened');
      });
    });

    const parser1 = ports[0].pipe(new ReadlineParser({ delimiter: '\r\n' }));

    parser1.on('data', (data) => {
      console.log(data.toString());
      mainWindow?.webContents.send('one', data.toString());
    });
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
