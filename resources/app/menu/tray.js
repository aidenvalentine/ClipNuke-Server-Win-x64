 const { BrowserWindow } = require('electron').remote
 const {Tray, Menu} = remote
 const path = require('path')

 let trayIcon = new Tray(path.join('','icon/clipnuke-logo.jpg'))

 const trayMenuTemplate = [
	{
	   label: 'Empty Application',
	   enabled: false
	},
	
	{
	   label: 'Login',
	   click: function () {
		  console.log("Clicked on login")
		  let win = new BrowserWindow({ width: 800, height: 600 })
		  win.loadFile(path.join(__dirname, 'index-login.html')) // Login
	   }
	},
	
	{
	   label: 'Dashboard',
	   click: function () {
		  console.log("Clicked on dashboard")
		  let win = new BrowserWindow({ width: 800, height: 600 })
		  win.loadURL('https://clipnuke.com/wp-admin/index.php') // Login
	   }
	},
	
	{
	   label: 'Manage Videos',
	   click: function () {
		  console.log("Clicked on videos")
		  let win = new BrowserWindow({ width: 800, height: 600 })
		  win.loadURL('https://clipnuke.com/wp-admin/edit.php?post_type=product');
	   }
	},
	
	{
	   label: 'Settings',
	   click: function () {
		  console.log("Clicked on settings")
		  let win = new BrowserWindow({ width: 800, height: 600 })
		  win.loadFile(path.join(__dirname, 'index-login.html')) // Login
	   }
	},
	
	{
	   label: 'Help',
	   click: function () {
		  console.log("Clicked on Help")
	   }
	}
 ]
 
 let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
 trayIcon.setContextMenu(trayMenu)