"use strict"

const builder = require("electron-builder")
const Platform = builder.Platform

// Promise is returned
builder.build({
    targets: Platform.MAC.createTarget(),
    config: {
      "provider": 'github',
      "repo": 'ClipNuke-Server-Winx64',
      // "owner": 'txm-nero',
      "private": false,
      // "token": '',
      "directories": {
        "output": "build"
      },
      "appId": "com.valleytech.clipnuke",
      "productName": "ClipNuke",
      "copyright": "Copyright © 2019 ClipNuke.com",

      "mac": {
        "target": "mas",
        "type": "distribution",
        "provisioningProfile": "myApp.provisionprofile",
        "identity": "ClipNuke (idNumber)"
      },

      "win": {
        "target": "nsis"
      }
    }
  })

  .then(() => {
    // handle result
  })
  .catch((error) => {
    // handle error
  })
