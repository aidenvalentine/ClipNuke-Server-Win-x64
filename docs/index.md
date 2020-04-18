# ClipNuke Server
ClipNuke Server provides adult content creators with a REST API, and framework for full and semi-automatic content distribution. Interfaces with several major clip sites, CMS, and tubes including: Clips4Sale, ManyVids, PornHub/ModelHub, XVideos, XVideos RED, ModelCentro, WooCommerce, AdultEmpire, AEBN, and Hot Movies.

## Requirements
1. Node.js installed on your PC. (https://nodejs.org/en/download/)
1. JAVA installed on your PC. Add the PATH to JAVA's executables (java.exe) to your system's PATH environment variable. (https://java.com/en/download/manual.jsp)

## Installation
1. Clone this repository to your PC.
1. Unzip and move/rename the folder to C:/Program Files/ClipNuke
1. Open command prompt.
1. Change current directory to the program's folder. Use command: `cd %ProgramFiles%/ClipNuke`
1. Install project dependencies using command: `npm install`.


## Getting Started
1. Run **clipnuke.exe**
1. Start required services using the "Help" menu.
  1. Start hub (F3)
  1. Add at least one Node (F4)
  1. Start Adult Content API Server (F6)
1. Configure your settings, and add credentials for each clip store. Global configuration stored as a JSON file located in `%APPDATA%/clipnuke/config.json`. __This data is securely saved to a config file on your PC.__

## Developers
Use ClipNuke Server REST API to power your own custom applications, or to setup a custom workflow for your store(s). The API server is built on the ExpressJS framework. See which RESTful API routes are available by viewing the code in the `{root}/resources/app/resources/app/` folder.

`server.js` is the ExpressJS server.
