const {Menu, ipcRenderer, remote, BrowserWindow, dialog } = require('electron')
const { autoUpdater } = require("electron-updater")
const electron = require('electron')
const path = require('path');
const { updates } = require(path.resolve(__dirname, 'updater.js'))
// const updater = require(path.join(__dirname, 'updater.js'));
const app = electron.app

const template = [
  {
    label: 'Account',
    submenu: [
  	{
  	   label: 'Login',
  	   click: function () {
  			console.log("Clicked on login")
  			let win = new BrowserWindow({ width: 800, height: 600 })
  			win.loadURL('https://clipnuke.com/wp-admin/index.php') // Login
  			win.on('closed', () => {
  			  win = null
  			})
  	   }
  	},

  	{
  		type: 'separator'
  	},

  	{
  	   label: 'Dashboard',
  		click: function () {
  			console.log("Clicked on dashboard")
  			let win = new BrowserWindow({ width: 800, height: 600 })
  			win.loadURL('https://clipnuke.com/wp-admin/index.php') // Login
  			win.on('closed', () => {
  			  win = null
  			})
  	    }
  	},

  	{
  	   label: 'Upload Video',
  		click: function () {
  			let win = new BrowserWindow({ width: 800, height: 600 })
        const dialog = require('electron').dialog;
        dialog.showOpenDialog({ properties: [ 'multiSelections' ]})
  	    }
  	},

  	{
  	   label: 'Manage Videos',
  	   click: function () {
  		  console.log("Clicked on videos")
  		  let win = new BrowserWindow({ fullscreen: true })
  		  win.loadURL('https://clipnuke.com/wp-admin/edit.php?post_type=product');
  			win.on('closed', () => {
  			  win = null
  			})
  	   }
  	}]
  },
  {
    label: 'Windows',
    submenu: [
  	{
  	   label: 'Status',
  	   click: function () {
  			console.log("Clicked on login")
  			let win = new BrowserWindow({ width: 800, height: 600 })
  			win.loadURL('resources/app/html/page-status.html') // Login
  			win.on('closed', () => {
  			  win = null
  			})
  	   }
  	}]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
	    {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Go to ClipNuke.com',
        click () { require('electron').shell.openExternal('https://clipnuke.com') },
    		accelerator: 'F12'
    },
	  {
        label: 'Settings',
        click: function () {
          let win = new BrowserWindow({
        		x: 800, y: 0,
        		width: 800,
        		height: 900,
        		titleBarStyle: "hidden",
        		webPreferences: { nodeIntegration: true },
        		// icon: path.join(__dirname, 'icon/clipnuke-logo.jpg'),
        		allowRunningInsecureContent: true,
        		webSecurity: false
        	})
          win.loadURL(path.join(__dirname, '..', 'preferences.html')) // Login
          win.on('closed', () => {
            win = null
          })
        },
    		accelerator: 'F10'
    },
	  {
        label: 'Start Hub',
        click () {
    			require('electron').shell.openItem( path.join(__dirname, '..', 'bin/selenium-hub.bat'));
			// let win = new BrowserWindow({ width: 800, height: 600 })
			// win.loadURL('http://localhost:4444/grid/console') // Login
			// require('electron').shell.openItem( 'http://localhost:4444/grid/console' )
		    },
		    accelerator: 'F3'
    },
	  {
        label: 'Add Node',
        click () { require('electron').shell.openItem( path.join(__dirname, '..', 'bin/selenium-node.bat') ) },
    		accelerator: 'F4'
    },
	  {
        label: 'Start Adult Content API Server',
        click () { require('electron').shell.openItem( path.join(__dirname, '..', 'bin/adult-content-api.bat') ) },
        accelerator: 'F6'
    },
	  {
        label: 'View Nodes',
        click () {
    			let win = new BrowserWindow({ width: 800, height: 600 })
    			win.loadURL('http://localhost:4444/grid/console') // Login
        },
    		accelerator: 'F5'
    },
	  {
        label: 'FTP Uploads',
        click () { require('electron').shell.openExternal( 'ftp://192.168.1.151/' ) }, // Make this a preferences variable.
        accelerator: 'F7'
      },
	  {
        label: 'Update',
        click: function() {
          autoUpdater.checkForUpdatesAndNotify();
        },
    		accelerator: 'F8'
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
