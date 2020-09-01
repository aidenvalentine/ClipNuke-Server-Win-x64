"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startWebDriverSession = startWebDriverSession;
exports.isSuccessfulResponse = isSuccessfulResponse;
exports.getPrototype = getPrototype;
exports.getErrorFromResponseBody = getErrorFromResponseBody;
exports.getEnvironmentVars = getEnvironmentVars;
exports.setupDirectConnect = setupDirectConnect;
exports.getSessionError = exports.CustomRequestError = void 0;

var _lodash = _interopRequireDefault(require("lodash.merge"));

var _logger = _interopRequireDefault(require("@wdio/logger"));

var _protocols = require("@wdio/protocols");

var _request = _interopRequireDefault(require("./request"));

var _command = _interopRequireDefault(require("./command"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _logger.default)('webdriver');
const BROWSER_DRIVER_ERRORS = ['unknown command: wd/hub/session', 'HTTP method not allowed', "'POST /wd/hub/session' was not found.", 'Command not found'];

async function startWebDriverSession(params) {
  const [w3cCaps, jsonwpCaps] = params.capabilities && params.capabilities.alwaysMatch ? [params.capabilities, params.capabilities.alwaysMatch] : [{
    alwaysMatch: params.capabilities,
    firstMatch: [{}]
  }, params.capabilities];
  const sessionRequest = new _request.default('POST', '/session', {
    capabilities: w3cCaps,
    desiredCapabilities: jsonwpCaps
  });
  let response;

  try {
    response = await sessionRequest.makeRequest(params);
  } catch (err) {
    log.error(err);
    const message = getSessionError(err);
    throw new Error('Failed to create session.\n' + message);
  }

  const sessionId = response.value.sessionId || response.sessionId;
  params.requestedCapabilities = {
    w3cCaps,
    jsonwpCaps
  };
  params.capabilities = response.value.capabilities || response.value;
  return sessionId;
}

function isSuccessfulResponse(statusCode, body) {
  if (!body || typeof body.value === 'undefined') {
    log.debug('request failed due to missing body');
    return false;
  }

  if (body.status === 7 && body.value && body.value.message && (body.value.message.toLowerCase().startsWith('no such element') || body.value.message === 'An element could not be located on the page using the given search parameters.' || body.value.message.toLowerCase().startsWith('unable to find element'))) {
    return true;
  }

  if (body.status && body.status !== 0) {
    log.debug(`request failed due to status ${body.status}`);
    return false;
  }

  const hasErrorResponse = body.value && (body.value.error || body.value.stackTrace || body.value.stacktrace);

  if (statusCode === 200 && !hasErrorResponse) {
    return true;
  }

  if (statusCode === 404 && body.value && body.value.error === 'no such element') {
    return true;
  }

  if (hasErrorResponse) {
    log.debug('request failed due to response error:', body.value.error);
    return false;
  }

  return true;
}

function getPrototype({
  isW3C,
  isChrome,
  isMobile,
  isSauce,
  isSeleniumStandalone
}) {
  const prototype = {};
  const ProtocolCommands = (0, _lodash.default)(isMobile ? (0, _lodash.default)({}, _protocols.JsonWProtocol, _protocols.WebDriverProtocol) : isW3C ? _protocols.WebDriverProtocol : _protocols.JsonWProtocol, isMobile ? (0, _lodash.default)({}, _protocols.MJsonWProtocol, _protocols.AppiumProtocol) : {}, isChrome ? _protocols.ChromiumProtocol : {}, isSauce ? _protocols.SauceLabsProtocol : {}, isSeleniumStandalone ? _protocols.SeleniumProtocol : {});

  for (const [endpoint, methods] of Object.entries(ProtocolCommands)) {
    for (const [method, commandData] of Object.entries(methods)) {
      prototype[commandData.command] = {
        value: (0, _command.default)(method, endpoint, commandData, isSeleniumStandalone)
      };
    }
  }

  return prototype;
}

function getErrorFromResponseBody(body) {
  if (!body) {
    return new Error('Response has empty body');
  }

  if (typeof body === 'string' && body.length) {
    return new Error(body);
  }

  if (typeof body !== 'object' || !body.value) {
    return new Error('unknown error');
  }

  return new CustomRequestError(body);
}

class CustomRequestError extends Error {
  constructor(body) {
    super(body.value.message || body.value.class || 'unknown error');

    if (body.value.error) {
      this.name = body.value.error;
    } else if (body.value.message && body.value.message.includes('stale element reference')) {
      this.name = 'stale element reference';
    }
  }

}

exports.CustomRequestError = CustomRequestError;

function getEnvironmentVars({
  isW3C,
  isMobile,
  isIOS,
  isAndroid,
  isChrome,
  isSauce,
  isSeleniumStandalone
}) {
  return {
    isW3C: {
      value: isW3C
    },
    isMobile: {
      value: isMobile
    },
    isIOS: {
      value: isIOS
    },
    isAndroid: {
      value: isAndroid
    },
    isChrome: {
      value: isChrome
    },
    isSauce: {
      value: isSauce
    },
    isSeleniumStandalone: {
      value: isSeleniumStandalone
    }
  };
}

function setupDirectConnect(params) {
  const {
    directConnectProtocol,
    directConnectHost,
    directConnectPort,
    directConnectPath
  } = params.capabilities;

  if (directConnectProtocol && directConnectHost && directConnectPort && (directConnectPath || directConnectPath === '')) {
    log.info('Found direct connect information in new session response. ' + `Will connect to server at ${directConnectProtocol}://` + `${directConnectHost}:${directConnectPort}/${directConnectPath}`);
    params.protocol = directConnectProtocol;
    params.hostname = directConnectHost;
    params.port = directConnectPort;
    params.path = directConnectPath;
  }
}

const getSessionError = err => {
  if (err.code === 'ECONNREFUSED') {
    return `Unable to connect to "${err.address}:${err.port}", make sure browser driver is running on that address.` + '\nIf you use services like chromedriver see initialiseServices logs above or in wdio.log file.';
  }

  if (!err.message) {
    return 'See logs for more information.';
  }

  if (err.message.includes('Whoops! The URL specified routes to this help page.')) {
    return "It seems you are running a Selenium Standalone server and point to a wrong path. Please set `path: '/wd/hub'` in your wdio.conf.js!";
  }

  if (BROWSER_DRIVER_ERRORS.some(m => err.message.includes(m))) {
    return "Make sure to set `path: '/'` in your wdio.conf.js!";
  }

  if (err.message.includes('Bad Request - Invalid Hostname') && err.message.includes('HTTP Error 400')) {
    return "Run edge driver on 127.0.0.1 instead of localhost, ex: --host=127.0.0.1, or set `hostname: 'localhost'` in your wdio.conf.js";
  }

  const w3cCapMessage = '\nMake sure to add vendor prefix like "goog:", "appium:", "moz:", etc to non W3C capabilities.' + '\nSee more https://www.w3.org/TR/webdriver/#capabilities';

  if (err.message.includes('Illegal key values seen in w3c capabilities')) {
    return err.message + w3cCapMessage;
  }

  if (err.message === 'Response has empty body') {
    return 'Make sure to connect to valid hostname:port or the port is not in use.' + '\nIf you use a grid server ' + w3cCapMessage;
  }

  return err.message;
};

exports.getSessionError = getSessionError;