const {
  app,
  BrowserWindow
} = require('electron');

let demo;

app.on('ready', () => {

  demo = new BrowserWindow();
  demo.loadURL(`file:///${__dirname}/demo2-vertical-dark.html`);
  demo.on('close', () => { demo = null });
  
});