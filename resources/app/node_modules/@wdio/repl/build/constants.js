"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INTRO_MESSAGE = exports.STATIC_RETURNS = void 0;
const STATIC_RETURNS = {
  'driver': '[WebdriverIO REPL client]',
  'browser': '[WebdriverIO REPL client]',
  '$': '[Function: findElement]',
  '$$': '[Function: findElements]'
};
exports.STATIC_RETURNS = STATIC_RETURNS;
const INTRO_MESSAGE = `
The execution has stopped!
You can now go into the browser or use the command line as REPL
(To exit, press ^C again or type .exit)
`;
exports.INTRO_MESSAGE = INTRO_MESSAGE;