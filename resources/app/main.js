// Modules to control application life and create native browser window
const {app, BrowserWindow, session, ipcMain} = require('electron');
const autoUpdater = require('electron-updater').autoUpdater;
const { exec } = require('child_process');
const path = require('path')
const os = require('os')
const url = require('url');
const Store = require('electron-store');

const store = new Store();

/** Config */
store.set('app.name', "ClipNuke");
store.set('app.tagline', "Weapon of Mass Distribution");

// Live-Reload App
// require('electron-reload')(__dirname) // Dev Only!!

//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
var win;

function sendStatusToWindow(text) {
  // log.info(text);
  win.webContents.send('message', text);
}
function updatesWindow() {
  win = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
			allowRunningInsecureContent: true
    },
    width: 1280,
    height: 720
  });
  //win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (ev, info) => {
	console.log("Update Downloaded", info);
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  sendStatusToWindow('Update downloaded');

  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 5000)
})

/** SSL/HTTPS */
app.commandLine.appendSwitch('ignore-certificate-errors', 'true'); // Ignore SSL Errors
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow () {

	// Load Menus
	require('./menu/mainmenu')
	// require('./menu/tray')

	mainWindow = new BrowserWindow({
		x: 800, y: 0,
		width: 800,
		height: 900,
		titleBarStyle: "hidden",
		webPreferences: { nodeIntegration: true },
		// icon: path.join(__dirname, 'icon/clipnuke-logo.jpg'),
		allowRunningInsecureContent: true,
		webSecurity: false
	})
	mainWindow.on('closed', () => {
	  mainWindow = null
	})

	// Load a remote URL
	mainWindow.loadFile('resources/app/html/page-status.html')

	// Open settings on first run
	if (!store.get('settings')) {
		configWindow();
	}

	// updatesWindow(); // Disabled temporarily.
	autoUpdater.setFeedURL({ provider: 'github', owner: 'aidenvalentine', repo: 'ClipNuke-Server-Win-x64' });
	autoUpdater.checkForUpdates();
  autoUpdater.checkForUpdatesAndNotify();
	setTimeout(function() {
    // autoUpdater.quitAndInstall();
  }, 5000)
}

function configWindow () {

	// Load Menus
	require('./menu/mainmenu')
	// require('./menu/tray')

	let configWin = new BrowserWindow({
		x: 800, y: 0,
		width: 800,
		height: 900,
		titleBarStyle: "hidden",
		webPreferences: { nodeIntegration: true },
		// icon: path.join(__dirname, 'icon/clipnuke-logo.jpg'),
		allowRunningInsecureContent: true,
		webSecurity: false
	})
	configWin.on('closed', () => {
	  configWin = null
	})

	// Load a remote URL
	configWin.loadFile('preferences.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow, function() {
	autoUpdater.checkForUpdates();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
	// updatesWindow();
  // if (mainWindow === null) updatesWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/** JumpList */
app.setUserTasks([
  {
    program: path.join(__dirname, 'bin/adult-content-api.bat'),
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'Start Adult Content API',
    description: 'Starts API Server'
  }
])
