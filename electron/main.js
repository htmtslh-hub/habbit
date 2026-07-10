const { app, BrowserWindow, Menu, Tray, shell, dialog, nativeImage } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

// ===== CONSTANTS =====
const APP_NAME = 'Habit Game Tracker';
const IS_DEV = !app.isPackaged;
const WEB_DIR = IS_DEV
    ? path.join(__dirname, '..')   // Dev: web files are in parent directory
    : path.join(path.dirname(app.getPath('exe')), 'web'); // Packaged: web files in /web/ folder
const LOCAL_PORT = 17532; // Random high port for local server

let mainWindow = null;
let tray = null;
let localServer = null;

// ===== SINGLE INSTANCE LOCK =====
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// ===== MIME TYPES =====
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
};

// ===== LOCAL HTTP SERVER =====
function startLocalServer() {
    return new Promise((resolve, reject) => {
        localServer = http.createServer((req, res) => {
            // Parse URL (remove query strings)
            let reqPath = decodeURIComponent(req.url.split('?')[0]);
            
            // Default to index.html
            if (reqPath === '/') reqPath = '/index.html';

            // Resolve file path
            const filePath = path.join(WEB_DIR, reqPath);

            // Security: prevent path traversal
            const normalizedFull = path.resolve(filePath);
            const normalizedWeb = path.resolve(WEB_DIR);
            if (!normalizedFull.startsWith(normalizedWeb)) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }

            // Check if file exists
            if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                // Try with .html extension
                const htmlPath = filePath + '.html';
                if (fs.existsSync(htmlPath)) {
                    serveFile(htmlPath, res);
                    return;
                }
                res.writeHead(404);
                res.end('Not Found');
                return;
            }

            serveFile(filePath, res);
        });

        localServer.listen(LOCAL_PORT, '127.0.0.1', () => {
            console.log(`Local server running at http://127.0.0.1:${LOCAL_PORT}`);
            resolve();
        });

        localServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                // Port in use, try next
                console.warn(`Port ${LOCAL_PORT} in use, trying ${LOCAL_PORT + 1}`);
                localServer.listen(LOCAL_PORT + 1, '127.0.0.1', () => {
                    console.log(`Local server running at http://127.0.0.1:${LOCAL_PORT + 1}`);
                    resolve();
                });
            } else {
                reject(err);
            }
        });
    });
}

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache',
        });
        res.end(data);
    } catch (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}

function getServerUrl() {
    const address = localServer.address();
    return `http://127.0.0.1:${address.port}`;
}

// ===== CREATE MAIN WINDOW =====
function createWindow() {
    const iconPath = path.join(WEB_DIR, 'icon-512.png');

    let icon;
    try {
        icon = nativeImage.createFromPath(iconPath);
    } catch (e) {
        icon = undefined;
    }

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 900,
        minHeight: 600,
        title: APP_NAME,
        icon: icon,
        backgroundColor: '#0a0a1a',
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            spellcheck: false,
        },
    });

    // Load auth page via local server
    mainWindow.loadURL(`${getServerUrl()}/auth.html`);

    // Show window when ready (avoid flash)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Handle navigation within the app
    mainWindow.webContents.on('will-navigate', (event, navUrl) => {
        // Allow internal navigation (localhost)
        if (navUrl.startsWith(getServerUrl())) return;

        // For external URLs (Firebase auth popup, etc.), allow them
        if (navUrl.includes('accounts.google.com') || 
            navUrl.includes('firebaseapp.com') ||
            navUrl.includes('googleapis.com')) {
            return;
        }

        // Open other external links in default browser
        event.preventDefault();
        shell.openExternal(navUrl);
    });

    // Handle new window requests (e.g., Google sign-in popup)
    mainWindow.webContents.setWindowOpenHandler(({ url: reqUrl }) => {
        if (reqUrl.includes('accounts.google.com') || 
            reqUrl.includes('firebaseapp.com') ||
            reqUrl.includes('googleapis.com')) {
            return { action: 'allow' };
        }
        shell.openExternal(reqUrl);
        return { action: 'deny' };
    });

    // Handle window close → minimize to tray
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// ===== APPLICATION MENU =====
function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Về trang chính',
                    accelerator: 'CmdOrCtrl+Shift+H',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.loadURL(`${getServerUrl()}/index.html`);
                        }
                    }
                },
                {
                    label: 'Admin Dashboard',
                    accelerator: 'CmdOrCtrl+Shift+A',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.loadURL(`${getServerUrl()}/admin.html`);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Thoát',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.isQuitting = true;
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo', label: 'Hoàn tác' },
                { role: 'redo', label: 'Làm lại' },
                { type: 'separator' },
                { role: 'cut', label: 'Cắt' },
                { role: 'copy', label: 'Sao chép' },
                { role: 'paste', label: 'Dán' },
                { role: 'selectAll', label: 'Chọn tất cả' },
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload', label: 'Tải lại' },
                { role: 'forceReload', label: 'Tải lại (bỏ cache)' },
                { type: 'separator' },
                { role: 'zoomIn', label: 'Phóng to' },
                { role: 'zoomOut', label: 'Thu nhỏ' },
                { role: 'resetZoom', label: 'Kích thước gốc' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Toàn màn hình' },
                { type: 'separator' },
                { role: 'toggleDevTools', label: 'Developer Tools' },
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Về Habit Game Tracker',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Habit Game Tracker',
                            message: 'Habit Game Tracker v1.0.0',
                            detail: 'Ứng dụng theo dõi thói quen hàng ngày.\n\n© 2026 SonnHai.\nPowered by Electron + Firebase.',
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// ===== SYSTEM TRAY =====
function createTray() {
    const iconPath = path.join(WEB_DIR, 'icon-192.png');

    let trayIcon;
    try {
        trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    } catch (e) {
        return; // Skip tray if icon not found
    }

    tray = new Tray(trayIcon);
    tray.setToolTip(APP_NAME);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Mở Habit Game Tracker',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Thoát',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// ===== APP LIFECYCLE =====
app.whenReady().then(async () => {
    await startLocalServer();
    createMenu();
    createWindow();
    createTray();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else if (mainWindow) {
        mainWindow.show();
    }
});

app.on('before-quit', () => {
    app.isQuitting = true;
    // Shutdown local server
    if (localServer) {
        localServer.close();
    }
});
