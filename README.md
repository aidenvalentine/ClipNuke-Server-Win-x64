# ClipNuke Server
ClipNuke Server provides adult content creators with a REST API, and framework for full and semi-automatic content distribution. Interfaces with several major clip sites, CMS, and tubes including: Clips4Sale, ManyVids, PornHub/ModelHub, XVideos/XVideos RED, ModelCentro, WooCommerce, AdultEmpire, AEBN, and Hot Movies.

The philosophy for this project is to allow adult content creators to reduce the amount of copy/pasting by posting any given clip/video to all their distributor's sites. We want to use ONE title, description, images, video files, etc. and **cross-post** it to every platform you sell content on.

## Download
Clone/download ZIP archive from (https://github.com/aidenvalentine/ClipNuke-Server-Win-x64.git).

## Screenshots
![Screenshot 1](https://github.com/aidenvalentine/ClipNuke-Server-Win-x64/raw/master/docs/images/clipnuke-screenshot-2.png)
![Screenshot 2](https://github.com/aidenvalentine/ClipNuke-Server-Win-x64/raw/master/docs/images/clipnuke-screenshot-3.png)

## How it Works

When you add a new clip to a platform using the ClipNuke REST API, the software:
1. Opens a new Google Chrome browser window automatically.
1. Prefills the login form.
1. Navigates to the platform's "add clip" page.
1. Prefills the form will all the information you provide.

Some sites, like XVideos support multiple language translations. ClipNuke Server includes a multi-language translator to automatically translate your video titles into any language with a one click. You need to set a Microsoft Azure API Key in the Settings menu to enable this feature.

[![](http://img.youtube.com/vi/z71oRkNRAQU/0.jpg)](http://www.youtube.com/watch?v=z71oRkNRAQU "ClipNuke Auto-Translator")

**Note**: Some platforms may be completely automated, while others may require you to manually populate unsupported form fields. The browser window will stay open, awaiting your input if more information is required to post it.

## Requirements
1. Node.js installed on your PC. (https://nodejs.org/en/download/)
1. JAVA installed on your PC. Add the PATH to JAVA's executables (java.exe) to your system's PATH environment variable. (https://java.com/en/download/manual.jsp)

## Installation
1. Clone this repository to your PC.
1. Unzip and move/rename the folder to C:/Program Files/ClipNuke
1. Open command prompt.
1. Change current directory to the program's installation directory. Use command: `cd %ProgramFiles%/ClipNuke`
1. Install project dependencies using command: `npm install`.


## Getting Started
1. Run **clipnuke.exe**
1. Configure your settings. The config window will open the first time you run ClipNuke, or if the config.json file is empty. Add your credentials for each clip store in the Settings window. You can re-open this page anytime by using the Help > Settings link in the top menu, or by pressing F10 on the keyboard. Config file located in `%APPDATA%/clipnuke/config.json`. __This data is securely saved to a config file on your PC.__
1. Start required services using the "Help" menu.
    1. Start hub (Press F3)
    1. Add at least one Node (Press F4)
    1. Start Adult Content API Server (Press F6)

## Developers
Use ClipNuke Server REST API to power your own custom applications, or to setup a custom workflow for your store(s). The API server is built on the ExpressJS framework. See which RESTful API routes are available by viewing the code in the `{root}/resources/app/resources/app/` folder.

`server.js` is the ExpressJS server.
