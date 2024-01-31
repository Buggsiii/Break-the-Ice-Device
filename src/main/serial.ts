import { BrowserWindow } from 'electron';

function init(mainWindow: BrowserWindow | null) {
  mainWindow?.webContents.on('did-finish-load', () => {
    console.log('did-finish-load');
    mainWindow?.webContents.send('button', '2');
  });
}

export default { init };
