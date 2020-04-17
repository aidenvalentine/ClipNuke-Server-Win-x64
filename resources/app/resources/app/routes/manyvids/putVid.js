const fs = require('fs');
const path = require('path');
const webdriverio = require('webdriverio');

// Webdriver Client Instance
var config = {
  desiredCapabilities: {
    browserName: 'chrome',
    chromeOptions: {
      binary: path.join(__dirname, '../../../../bin/chromedriver.exe')
    },
  },
  singleton: true, // Enable persistent sessions
  debug: true
};
var client = webdriverio.remote(config);
const conf = require(path.join(process.env.APPDATA, "clipnuke", "config.json"))
var event = JSON.parse(process.argv[2]);

client
  .init()
  .url('https://www.manyvids.com/Login/')
  .setValue('#triggerUsername', conf.settings.manyvids.user)
  .setValue('#triggerPassword', conf.settings.manyvids.pass)
  .waitForVisible('body > div.mv-profile', 30000)
  .pause(2000)
  .url(`https://www.manyvids.com/Edit-vid/${event.manyvids_id}/`)
  .waitForVisible('input#Title', 60000)
  .execute(function(event) {
    $(document).ready(function() {
      // Title
      $('[name="video_title"]').val(event.name);
      // Description
      $('[name="video_description"]').val(event.description.replace(/(<([^>]+)>)/ig, "")); // Strip HTML tags

      // Teaser
      // Thumbnail
      // Categories

      // Pricing
      $('[name="video_cost"]').val(event.price || 9.99);

      $(".radio.my-2").click(); // Make This Vid Free
      $("#free_vid_1").click(); // MV Tube

      // Intensity
      $('#intensity').val(event.intensity || 0);
      $('#intensity').niceSelect('update');

      // Available on MV

      // Discount
      $("#sale").val(event.discountPercentage || "");
      $("#sale").niceSelect('update');

      // Exclusive?
      $("#exclusiveVid").prop("checked", event.exclusive || false);

      // Model Attributes - Too damn

      // Custom Vid Order?
      $("#show_customvid_table").prop("checked", event.exclusive || false);

      // Security Options

      // Block Teaser

      // Content Rating
      if (event.sfw === true) {
        $("#safe_for_work").val(1199); // SFW
      } else {
        $("#safe_for_work").val(); // NSFW (Default)
      }
      $("#safe_for_work").niceSelect('update');
    });
  }, event)

  .catch((e) => {
    client.end();
    console.log(e);
    // return callback(e);
  });
