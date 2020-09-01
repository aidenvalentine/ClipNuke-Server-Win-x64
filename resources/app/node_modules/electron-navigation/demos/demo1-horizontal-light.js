const {
  app,
  BrowserWindow
} = require('electron');

let demo;

app.on('ready', () => {

  demo = new BrowserWindow();
  demo.loadURL(`file:///${__dirname}/demo1-horizontal-light.html`);
  demo.on('close', () => { demo = null });
  
});