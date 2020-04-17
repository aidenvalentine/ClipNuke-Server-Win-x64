var pornhub = require('express').Router({ mergeParams: true });
var path = require('path')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// Helper
const ph = require('./phHelper.js');

const conf = require(path.join(process.env.APPDATA, "clipnuke", "config.json"));

// Webdriver Client Instance
const client = require('../../webdriverio/client.js').client;

// Test cookie - Pre-authenticated
// const cookie =  require('./cookie.json');

// Test Route
pornhub.get('/', (req, res) => {
  res.status(200).json({ message: 'Pornhub Router!' });
});

// Creates a new video
pornhub.post('/uploads', jsonParser, function (req, res) {
  var event = req.body;
  console.log(JSON.stringify(event, null, 2)); // Mock
  // res.json({}); // Mock Response
  var credentials = {
    user: conf.settings.pornhub.user,
    pass: conf.settings.pornhub.pass
  };
  const params = {
    client: client,
    // cookie: cookie
  };
  ph.login(credentials, params, function(err, data) {
    ph.postUpload(event, params, function(err, data) {
      console.log(data);
      res.json(data);
    });
  });
});

module.exports = pornhub;
