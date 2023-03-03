// main.js
// noinspection JSUnresolvedFunction,JSUnresolvedVariable

// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');
const os = require('os');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * Handle the search.
 *
 * @param event Event
 * @param query Search Term
 */
async function handleSearch(event, query) {
    console.debug('Search for query: ' + query);

    const command = 'winget search ' + query + ' --disable-interactivity';
    console.debug('Command: ' + command);

    try {
        const {stdout, stderr} = await exec(command);
        if (stderr) {
            console.error('Error during execution');
            console.error(stderr);
        }
        console.debug('Command output is');
        console.debug(stdout);

        // Nothing returned
        if (stdout === undefined || stdout.length === 0) {
            return {
                success: false,
                results: []
            };
        }

        // No packages found.
        // Es wurde kein Paket gefunden, das den Eingabekriterien entspricht.
        if (stdout.indexOf('Es wurde kein Paket gefunden') > 0) { // TODO Translate
            return {
                success: true,
                results: []
            };
        }

        // Extract the header and parse indexes of the columns
        const sHeaderRow = stdout.substring(stdout.indexOf('Name'), stdout.indexOf('\r\n'));
        const aColIndexes = [];
        aColIndexes.push(sHeaderRow.indexOf("Name"));
        aColIndexes.push(sHeaderRow.indexOf("ID"));
        aColIndexes.push(sHeaderRow.indexOf("Version"));
        aColIndexes.push(sHeaderRow.indexOf("bereinstimmung") - 1); // TODO Translate
        aColIndexes.push(sHeaderRow.indexOf("Quelle")); // TODO Translate
        console.debug(aColIndexes);

        // Extract the table content and rows
        let sBodyText = stdout.substring(stdout.indexOf('\r\n') + 2, stdout.length);
        sBodyText = sBodyText.substring(sBodyText.indexOf('\r\n') + 2, sBodyText.length);
        console.debug(sBodyText);

        let aRows = sBodyText.split("\r\n");
        console.debug(sBodyText);

        const oResult = {
            success: true,
            results: []
        };

        aRows.forEach(sRow => {
            const oRow = {};
            for (let i = 1; i <= aColIndexes.length; i++) {
                let iStartIndex = aColIndexes[i - 1];
                let iEndIndex = aColIndexes[i];
                const sCol = sRow.substring(iStartIndex, iEndIndex).trim();
                console.debug(i + ": " + sCol);

                if (i === 1) {
                    oRow.name = sCol;
                } else if (i === 2) {
                    oRow.id = sCol;
                } else if (i === 3) {
                    oRow.version = sCol;
                } else if (i === 4) {
                    oRow.additional = sCol;
                } else if (i === 5) {
                    oRow.source = sCol;
                }
            }

            if (oRow.name !== undefined && oRow.name.length > 0) {
                oResult.results.push(oRow);
            }
        });

        return oResult;
    } catch (e) {
        console.error(e);
        return {
            success: false,
            results: []
        };
    }
}

/**
 * Register handling of IPC events.
 */
function registerIpcEvents() {
    ipcMain.handle('do-search', handleSearch);
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'index.html')).then(() => console.debug("index.html loaded"));

    // Enable keyboard shortcuts for Developer Tools on various platforms.
    let platform = os.platform();
    if (platform === 'darwin') {
        globalShortcut.register('Command+Option+I', () => {
            mainWindow.webContents.openDevTools();
        });
    } else if (platform === 'linux' || platform === 'win32') {
        globalShortcut.register('Control+Shift+I', () => {
            mainWindow.webContents.openDevTools();
        });
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    registerIpcEvents();

    createWindow();

    app.on('activate', () => {
        // On macOS, it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
