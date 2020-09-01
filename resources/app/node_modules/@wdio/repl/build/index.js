"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vm = _interopRequireDefault(require("vm"));

var _repl = _interopRequireDefault(require("repl"));

var _utils = require("@wdio/utils");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WDIORepl {
  constructor(config) {
    this.config = Object.assign({
      commandTimeout: 5000,
      eval: this.eval.bind(this),
      prompt: '\u203A ',
      useGlobal: true,
      useColor: true
    }, config);
    this.isCommandRunning = false;
  }

  eval(cmd, context, filename, callback) {
    if (this.isCommandRunning) {
      return;
    }

    if (cmd && _constants.STATIC_RETURNS[cmd.trim()]) {
      return callback(null, _constants.STATIC_RETURNS[cmd.trim()]);
    }

    _vm.default.createContext(context);

    this.isCommandRunning = true;

    if (_utils.hasWdioSyncSupport) {
      return (0, _utils.runFnInFiberContext)(() => this._runCmd(cmd, context, callback))();
    }

    return this._runCmd(cmd, context, callback);
  }

  _runCmd(cmd, context, callback) {
    try {
      const result = _vm.default.runInContext(cmd, context);

      return this._handleResult(result, callback);
    } catch (e) {
      this.isCommandRunning = false;
      return callback(e);
    }
  }

  _handleResult(result, callback) {
    if (!result || typeof result.then !== 'function') {
      this.isCommandRunning = false;
      return callback(null, result);
    }

    const timeout = setTimeout(() => {
      callback(new Error('Command execution timed out'));
      this.isCommandRunning = false;
      timeout._called = true;
    }, this.config.commandTimeout);
    result.then(res => {
      if (timeout._called) {
        return;
      }

      this.isCommandRunning = false;
      clearTimeout(timeout);
      return callback(null, res);
    }, e => {
      if (timeout._called) {
        return;
      }

      this.isCommandRunning = false;
      clearTimeout(timeout);
      const errorMessage = e ? e.message : 'Command execution timed out';
      const commandError = new Error(errorMessage);
      delete commandError.stack;
      return callback(commandError);
    });
  }

  start(context) {
    if (this.replServer) {
      throw new Error('a repl was already initialised');
    }

    if (context) {
      const evalFn = this.config.eval;

      this.config.eval = (cmd, _, filename, callback) => evalFn(cmd, context, filename, callback);
    }

    this.replServer = _repl.default.start(this.config);
    return new Promise(resolve => this.replServer.on('exit', resolve));
  }

}

exports.default = WDIORepl;

_defineProperty(WDIORepl, "introMessage", _constants.INTRO_MESSAGE);