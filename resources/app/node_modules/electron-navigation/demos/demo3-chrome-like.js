const {
  app,
  BrowserWindow
} = require('electron');

let demo;

app.on('ready', () => {

  demo = new BrowserWindow();
  demo.loadURL(`file:///${__dirname}/demo3-chrome-like.html`);
  demo.on('close', () => { demo = null });
  
});