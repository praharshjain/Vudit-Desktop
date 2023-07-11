require('v8-compile-cache');
const config = require('./config');
const fn = require('./functions');
const fs = require('fs');
const path = require('path');
const admZip = require('adm-zip');
const { https } = require('follow-redirects');
const MimeTypeParser = require("whatwg-mimetype");;
const mimeLookup = require('mime-lookup');
const mime = new mimeLookup(require('mime-db'));
const isDev = require('electron-is-dev');
const prompt = require('electron-prompt');
const { menubar } = require('menubar');
const { ElectronChromeExtensions } = require('electron-chrome-extensions');
const { app, shell, Menu, dialog, ipcMain, crashReporter, BrowserWindow, session, nativeImage } = require('electron');
const options = { extraHeaders: 'pragma: no-cache\n' };
const appIcon = nativeImage.createFromPath(config.iconPath);
const startURL = 'file://' + __dirname + '/photon/index.html';
const dropURL = 'file://' + __dirname + '/photon/drop.html';
let mainWindow, splashWindow, mb;
let contextMenu = null;
let filepath = null;

// creating menus for menu bar
const menuBarTemplate = [
  {
    label: config.appName,
    role: 'appMenu'
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            handleOpenFile();
          }
        },
      },
      {
        label: 'Open URL',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            handleOpenURL();
          }
        },
      },
      {
        label: 'Open Containing Folder',
        accelerator: 'CmdOrCtrl+F',
        click: function (item, focusedWindow) {
          if (focusedWindow && filepath)
            shell.showItemInFolder(filepath);
        },
      },
      {
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: function (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.print();
        },
      },
      {
        label: 'Close',
        accelerator: 'Shift+CmdOrCtrl+Z',
        click: function (item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.loadURL(startURL, options);
          }
        },
      },
      {
        type: 'separator',
      },
      { role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' },
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { type: 'separator' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { role: 'resetZoom' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [{ label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' }]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'About',
      click: function () {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          buttons: ['OK'],
          title: config.appName,
          message: 'Version ' + config.appVersion,
          detail: 'Created By - ' + config.author,
          icon: appIcon
        });
      }
    },
    { label: 'Learn More', click: function () { shell.openExternal('https://github.com/praharshjain/Electron-PDF-Viewer'); } },
    ]
  },
];
const contextMenuTemplate = [
  {
    label: 'Minimize',
    type: 'radio',
    role: 'minimize',
  },
  {
    type: 'separator',
  },
  {
    label: 'Exit',
    type: 'radio',
    role: 'quit',
  },
];
const menu = Menu.buildFromTemplate(menuBarTemplate);
// enable SharedArrayBuffer for ffmpeg-wasm
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');
app.setName(config.appName);
app.setAboutPanelOptions({ applicationName: config.appName, applicationVersion: config.appVersion, copyright: config.copyrightInfo, version: config.appVersion, credits: config.author, authors: [config.author], website: config.website, iconPath: config.iconPath });
crashReporter.start({ productName: config.appName, companyName: config.author, submitURL: config.website, autoSubmit: false });
forceSingleInstance();

app.on('ready', function () {
  showSplashWindow();
  Menu.setApplicationMenu(menu);
  // ipc stuff
  ipcMain.handle('openFile', (e, path) => {
    openFile(path);
  });
  ipcMain.handle('handleOpenFile', (e) => {
    handleOpenFile();
  });
  ipcMain.handle('handleOpenURL', (e) => {
    handleOpenURL();
  });
  ipcMain.handle('listFiles', (e, dir) => {
    return listFiles(dir);
  });
  ipcMain.on('getConfig', (e) => {
    e.returnValue = JSON.stringify(config);
  });
  ipcMain.on('getZipEntries', (e, path) => {
    e.returnValue = getZipEntries(path);
  });
  ipcMain.on('getPreviewURL', (e, path) => {
    e.returnValue = getPreviewURL(path);
  });

  //setup tray icon
  mbWebPreferences = {
    devTools: isDev,
    plugins: true,
    scrollBounce: true,
    backgroundThrottling: false,
    nodeIntegration: true,
    nodeIntegrationInWorker: true,
    nodeIntegrationInSubFrames: true,
    contextIsolation: false,
    preload: path.join(__dirname, 'functions.js'),
    defaultEncoding: 'UTF-8'
  };
  mb = menubar({
    index: dropURL,
    icon: appIcon.resize({ width: 20, height: 20 }),
    tooltip: config.appName,
    preloadWindow: true,
    showDockIcon: true,
    webPreferences: mbWebPreferences,
    browserWindow: {
      minWidth: 200,
      minHeight: 300,
      movable: false,
      show: false,
      alwaysOnTop: true,
      fullscreenable: false,
      frame: false,
      webPreferences: mbWebPreferences,
    },
  });
  mb.on('ready', () => {
    let tray = mb.tray;
    contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
    tray.setToolTip(config.appName);
    tray.on('right-click', (event, bounds) => {
      if (mb.window) {
        mb.window.close();
      }
      tray.popUpContextMenu(contextMenu);
    });
    //for OS-X
    if (app.dock) {
      app.dock.setIcon(appIcon);
      app.dock.setMenu(contextMenu);
    }
    if (isDev) {
      mb.window.openDevTools();
    } else {
      mb.window.webContents.on('devtools-opened', function (e) {
        e.preventDefault();
        this.closeDevTools();
      });
    }
  });
  //hide splash screen randomly after 2-3 seconds
  setTimeout(createMainWindow, (Math.random() + 2) * 1000);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (!isOSX()) {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});

// helper functions
function resetWindow(window) {
  if (window == null) {
    return
  }
  window.webContents.closeDevTools();
  window.webContents.clearHistory();
  if (window.webContents.session) {
    window.webContents.session.clearAuthCache();
    window.webContents.session.clearCache();
    window.webContents.session.clearHostResolverCache();
    window.webContents.session.closeAllConnections();
  }
}

function isOSX() {
  return process.platform !== 'darwin';
}

function forceSingleInstance() {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }
    });
  }
}

function showSplashWindow() {
  splashWindow = new BrowserWindow({
    accessibleTitle: config.appName,
    title: config.appName,
    icon: config.appIcon,
    width: 400,
    height: 300,
    center: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    fullscreenable: false,
    skipTaskbar: true,
    frame: false,
    roundedCorners: false,
  });
  splashWindow.setIcon(appIcon);
  splashWindow.setOverlayIcon(appIcon, config.appName);
  splashWindow.focus();
  splashWindow.loadURL('file://' + __dirname + '/splash.html', options);
}

function hideSplashWindow() {
  splashWindow.close();
  splashWindow.destroy();
  splashWindow = null;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    accessibleTitle: config.appName,
    title: config.appName,
    icon: appIcon,
    minWidth: 400,
    minHeight: 300,
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      devTools: isDev,
      plugins: true,
      scrollBounce: true,
      backgroundThrottling: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'functions.js'),
      defaultEncoding: 'UTF-8'
    }
  });
  mainWindow.setIcon(appIcon);
  mainWindow.setOverlayIcon(appIcon, config.appName);
  resetWindow(mainWindow);
  mainWindow.on('close', function (e) {
    resetWindow(mainWindow);
    mainWindow.destroy();
  });
  mainWindow.on('closed', function () {
    mainWindow = null;
    app.quit();
  });
  mainWindow.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
  mainWindow.webContents.on('will-navigate', function (e, url) {
    if (url.substr(0, 4) != 'file') {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
  if (isDev) {
    mainWindow.webContents.openDevTools();
    //TODO: try if we can get chrome extensions to work
    const extensions = new ElectronChromeExtensions();
    extensions.addTab(mainWindow.webContents, mainWindow);
    session.defaultSession.loadExtension('path/to/unpacked/extension').then(({ id }) => {
      //
    });
  } else {
    mainWindow.webContents.on('devtools-opened', function (e) {
      e.preventDefault();
      this.closeDevTools();
    });
  }
  mainWindow.loadURL(startURL, options);
  mainWindow.on('show', () => { mainWindow.focus(); });
  mainWindow.once('ready-to-show', () => {
    hideSplashWindow();
    mainWindow.maximize();
    mainWindow.show();
  });
}

function handleOpenURL() {
  prompt({
    title: 'Open URL',
    label: 'URL:',
    value: '',
    inputAttrs: { type: 'url' },
    type: 'input',
    alwaysOnTop: true,
  }).then((url) => {
    if (url != null) {
      openFile(url);
    }
  }).catch(console.error);
}

function handleOpenFile() {
  let path = dialog.showOpenDialogSync({
    filters: [
      {
        name: 'All Files',
        extensions: ['*'],
      },
      {
        name: 'Images',
        extensions: config.imageExt,
      },
      {
        name: 'Audio',
        extensions: config.audioExt,
      },
      {
        name: 'Video',
        extensions: config.videoExt,
      },
      {
        name: 'Documents',
        extensions: config.docExt,
      },
      {
        name: 'Archives',
        extensions: config.arcExt,
      },
    ],
    properties: ['openFile', 'showHiddenFiles'],
  });
  if (path) {
    if (path.constructor === Array) {
      path = path[0];
    }
    openFile(path);
  }
}

function getViewerURLByType(path, ext, mimeType) {
  let baseURL = 'file://' + __dirname;
  path = encodeURIComponent(path);
  if (ext in config.fileTypeMap) {
    return baseURL + config.fileTypeMap[ext].url + path;
  }
  if (mimeType in config.fileTypeMap) {
    return baseURL + config.fileTypeMap[mimeType].url + path;
  }
  if (mimeType.includes('text')) {
    return baseURL + config.fileTypeMap['txt'].url + path;
  }
  if (mimeType.includes('video')) {
    return baseURL + config.fileTypeMap['mp4'].url + path;
  }
  if (mimeType.includes('audio')) {
    return baseURL + config.fileTypeMap['mp3'].url + path;
  }
  if (mimeType.includes('image')) {
    return baseURL + config.fileTypeMap['png'].url + path;
  }
  console.log('\n\n unsupported file -> path: ' + path + ' ext: ' + ext + ' mimeType: ' + mimeType);
  return '';
}

function openFile(path) {
  if (path == '') {
    return;
  }
  filepath = path;
  //preference to extension/mime first
  let ext = fn.getFileExt(path);
  let mimeType = mime.lookup(path);
  let viewerURL = getViewerURLByType(path, ext, mimeType);
  if (viewerURL != '') {
    return mainWindow.loadURL(viewerURL, options);
  }
  //try to read content type from headers
  if (path.startsWith('http')) {
    https.request(path, { method: 'HEAD' }, (res) => {
      let contentType = new MimeTypeParser(res.headers['content-type']);
      mimeType = contentType.type + '/' + contentType.subtype;
      viewerURL = getViewerURLByType(path, mime.extension(mimeType), mimeType);
      if (viewerURL != '') {
        return mainWindow.loadURL(viewerURL, options);
      }
      showUnsupportedDialog();
    }).on('error', (err) => {
      console.error(err);
    }).end();
  } else {
    showUnsupportedDialog();
  }
}


function getPreviewURL(path) {
  if (path == '') {
    return '';
  }
  filepath = path;
  //preference to extension/mime first
  let ext = fn.getFileExt(path);
  let mimeType = mime.lookup(path);
  return getViewerURLByType(path, ext, mimeType);
}

function showUnsupportedDialog() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    buttons: ['OK'],
    title: 'Unsupported file type',
    message: 'The selected file type is not supported.',
  });
}

function getZipEntries(path) {
  let entries = new admZip(path).getEntries();
  let zipEntries = [];
  entries.forEach(function (entry) {
    zipEntries.push(createZipEntry(entry));
  });
  return zipEntries;
}

function createZipEntry(obj) {
  let name = obj.name;
  let version = obj.header.version;
  let modified = obj.header.time.toString();
  let crc = obj.header.crc;
  let method = obj.header.method;
  method = method == 8 ? 'Deflate' : 'Store';
  let comp_size = fn.getReadableSize({ isFile: !obj.isDirectory, size: obj.header.compressedSize });
  let orig_size = fn.getReadableSize({ isFile: !obj.isDirectory, size: obj.header.size });
  let icon = '';
  if (obj.isDirectory) {
    name = obj.entryName;
    crc = ' - ';
    icon = fn.getIcon({ isDir: true, path: name });
  }
  else {
    icon = fn.getIcon({ isFile: true, path: name });
  }
  return [icon + "<span style='vertical-align:super;'>" + name + "</span>", version, modified, comp_size, orig_size, crc, method];
}

function listFiles(dirPath) {
  let files = fs.readdirSync(dirPath);
  if (!files) {
    return;
  }
  let filesArr = [];
  if (dirPath != '/') {
    filesArr.push({ name: '..', path: path.join(dirPath, '/../'), isDir: true, isFile: false, isSymLink: false, isBackLink: true, type: '--' });
  }
  files.forEach(file => {
    let fullPath = path.join(dirPath, file);
    if (!fs.existsSync(fullPath)) {
      return
    }
    let f = fs.statSync(fullPath);
    let fileObj = {
      name: file,
      path: fullPath,
      parent: dirPath,
      isDir: f.isDirectory(),
      isFile: f.isFile(),
      isSymLink: f.isSymbolicLink(),
      isBackLink: false,
      mTime: f.mtime,
      size: f.size,
    }
    if (fileObj.isFile) {
      fileObj.ext = fn.getFileExt(fullPath);
      fileObj.mimeType = mime.lookup(fullPath);
      if (fileObj.ext in config.fileTypeMap) {
        fileObj.type = config.fileTypeMap[fileObj.ext].description;
      } else if (fileObj.mimeType in config.fileTypeMap) {
        fileObj.type = config.fileTypeMap[fileObj.mimeType].description;
      } else {
        fileObj.type = 'Unsupported';
      }
    } else {
      fileObj.type = '--';
    }
    filesArr.push(fileObj);
  });
  return sortFiles(filesArr);
}

function sortFiles(filesArr) {
  filesArr.sort(function (a, b) {
    if (a.isDir && !b.isDir) {
      return -1;
    } else if (!a.isDir && b.isDir) {
      return 1;
    }
    return a.name < b.name;
  });
  return filesArr;
}