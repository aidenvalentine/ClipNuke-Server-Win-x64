"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLogger;

function getLogger(component) {
  return ['error', 'warn', 'info', 'debug', 'trace', 'silent'].reduce((acc, cur) => {
    if (console[cur]) {
      acc[cur] = console[cur].bind(console, `${component}:`);
    }

    return acc;
  }, {});
}

getLogger.setLevel = () => {};

getLogger.setLogLevelsConfig = () => {};

getLogger.waitForBuffer = () => {};