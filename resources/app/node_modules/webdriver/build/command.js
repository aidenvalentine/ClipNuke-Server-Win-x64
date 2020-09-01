"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _logger = _interopRequireDefault(require("@wdio/logger"));

var _utils = require("@wdio/utils");

var _request = _interopRequireDefault(require("./request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _logger.default)('webdriver');

function _default(method, endpointUri, commandInfo, doubleEncodeVariables = false) {
  const {
    command,
    ref,
    parameters,
    variables = [],
    isHubCommand = false
  } = commandInfo;
  return function protocolCommand(...args) {
    let endpoint = endpointUri;
    const commandParams = [...variables.map(v => Object.assign(v, {
      required: true,
      type: 'string'
    })), ...parameters];
    const commandUsage = `${command}(${commandParams.map(p => p.name).join(', ')})`;
    const moreInfo = `\n\nFor more info see ${ref}\n`;
    const body = {};
    const minAllowedParams = commandParams.filter(param => param.required).length;

    if (args.length < minAllowedParams || args.length > commandParams.length) {
      const parameterDescription = commandParams.length ? `\n\nProperty Description:\n${commandParams.map(p => `  "${p.name}" (${p.type}): ${p.description}`).join('\n')}` : '';
      throw new Error(`Wrong parameters applied for ${command}\n` + `Usage: ${commandUsage}` + parameterDescription + moreInfo);
    }

    for (const [i, arg] of Object.entries(args)) {
      const commandParam = commandParams[i];

      if (!(0, _utils.isValidParameter)(arg, commandParam.type)) {
        if (typeof arg === 'undefined' && !commandParam.required) {
          continue;
        }

        const actual = commandParam.type.endsWith('[]') ? `(${(Array.isArray(arg) ? arg : [arg]).map(a => (0, _utils.getArgumentType)(a))})[]` : (0, _utils.getArgumentType)(arg);
        throw new Error(`Malformed type for "${commandParam.name}" parameter of command ${command}\n` + `Expected: ${commandParam.type}\n` + `Actual: ${actual}` + moreInfo);
      }

      if (i < variables.length) {
        const encodedArg = doubleEncodeVariables ? encodeURIComponent(encodeURIComponent(arg)) : encodeURIComponent(arg);
        endpoint = endpoint.replace(`:${commandParams[i].name}`, encodedArg);
        continue;
      }

      body[commandParams[i].name] = arg;
    }

    const request = new _request.default(method, endpoint, body, isHubCommand);
    this.emit('command', {
      method,
      endpoint,
      body
    });
    log.info('COMMAND', (0, _utils.commandCallStructure)(command, args));
    return request.makeRequest(this.options, this.sessionId).then(result => {
      if (result.value != null) {
        log.info('RESULT', /screenshot|recording/i.test(command) && typeof result.value === 'string' && result.value.length > 64 ? `${result.value.substr(0, 61)}...` : result.value);
      }

      this.emit('result', {
        method,
        endpoint,
        body,
        result
      });
      return result.value;
    });
  };
}