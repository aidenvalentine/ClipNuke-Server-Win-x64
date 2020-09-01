"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capabilitiesEnvironmentDetector = capabilitiesEnvironmentDetector;
exports.sessionEnvironmentDetector = sessionEnvironmentDetector;
exports.devtoolsEnvironmentDetector = devtoolsEnvironmentDetector;
exports.webdriverEnvironmentDetector = webdriverEnvironmentDetector;
const MOBILE_BROWSER_NAMES = ['ipad', 'iphone', 'android'];
const MOBILE_CAPABILITIES = ['appium-version', 'appiumVersion', 'device-type', 'deviceType', 'device-orientation', 'deviceOrientation', 'deviceName'];

function isW3C(capabilities) {
  if (!capabilities) {
    return false;
  }

  const isAppium = capabilities.automationName || capabilities.deviceName || capabilities.appiumVersion;
  const hasW3CCaps = capabilities.platformName && capabilities.browserVersion && (capabilities.platformVersion || Object.prototype.hasOwnProperty.call(capabilities, 'setWindowRect'));
  return Boolean(hasW3CCaps || isAppium);
}

function isChrome(caps) {
  if (!caps) {
    return false;
  }

  return Boolean(caps.chrome) || Boolean(caps['goog:chromeOptions']);
}

function isMobile(caps) {
  if (!caps) {
    return false;
  }

  const browserName = (caps.browserName || '').toLowerCase();
  return Boolean(Object.keys(caps).find(cap => MOBILE_CAPABILITIES.includes(cap)) || caps.browserName === '' || MOBILE_BROWSER_NAMES.includes(browserName));
}

function isIOS(caps) {
  if (!caps) {
    return false;
  }

  return Boolean(caps.platformName && caps.platformName.match(/iOS/i) || caps.deviceName && caps.deviceName.match(/(iPad|iPhone)/i));
}

function isAndroid(caps) {
  if (!caps) {
    return false;
  }

  return Boolean(caps.platformName && caps.platformName.match(/Android/i) || caps.browserName && caps.browserName.match(/Android/i));
}

function isSauce(caps) {
  return Boolean(caps.extendedDebugging || caps['sauce:options'] && caps['sauce:options'].extendedDebugging);
}

function isSeleniumStandalone(caps) {
  if (!caps) {
    return false;
  }

  return Boolean(caps['webdriver.remote.sessionid']);
}

function capabilitiesEnvironmentDetector(capabilities, automationProtocol) {
  return automationProtocol === 'devtools' ? devtoolsEnvironmentDetector(capabilities) : webdriverEnvironmentDetector(capabilities);
}

function sessionEnvironmentDetector({
  capabilities,
  requestedCapabilities
}) {
  return {
    isW3C: isW3C(capabilities),
    isChrome: isChrome(capabilities),
    isMobile: isMobile(capabilities),
    isIOS: isIOS(capabilities),
    isAndroid: isAndroid(capabilities),
    isSauce: isSauce(requestedCapabilities.w3cCaps.alwaysMatch),
    isSeleniumStandalone: isSeleniumStandalone(capabilities)
  };
}

function devtoolsEnvironmentDetector({
  browserName
}) {
  return {
    isDevTools: true,
    isW3C: true,
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isChrome: browserName === 'chrome',
    isSauce: false,
    isSeleniumStandalone: false
  };
}

function webdriverEnvironmentDetector(capabilities) {
  return {
    isChrome: isChrome(capabilities),
    isMobile: isMobile(capabilities),
    isIOS: isIOS(capabilities),
    isAndroid: isAndroid(capabilities),
    isSauce: isSauce(capabilities)
  };
}