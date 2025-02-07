

// main.js
const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;  // Check if running in development

// skipcq: JS-0116
async function createWindow() {
    // Set up CSP
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,

            }
        });
    });

    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: 'assets/images/icon.ico',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,

            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Load your web app URL
    mainWindow.loadURL('https://cms.locatify.com/');

    // Handle security warnings
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // Handle external links here
        if (url.startsWith('https://cms.locatify.com')) {
            return { action: 'allow' };
        }
        return { action: 'deny' };
    });

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});