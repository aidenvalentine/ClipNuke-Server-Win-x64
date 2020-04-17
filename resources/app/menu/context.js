 const {remote} = require('electron')
 const { BrowserWindow } = require('electron').remote
 const {Menu, MenuItem} = remote
 const menu = new Menu()

 // Build menu one item at a time, unlike
 menu.append(new MenuItem ({
	label: 'Back',
	click() { 
	   window.history.back();
	}
 }))
 
 menu.append(new MenuItem({type: 'separator'}))
 menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))
 menu.append(new MenuItem ({
	label: 'MenuItem3',
	click() {
	   console.log('item 3 clicked')
	}
 }))

 // Prevent default action of right click in chromium. Replace with our menu.
 window.addEventListener('contextmenu', (e) => {
	e.preventDefault()
	menu.popup(remote.getCurrentWindow())
 }, false)