"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WebDriver;

var _events = require("events");

var _logger = _interopRequireDefault(require("@wdio/logger"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SCOPE_TYPES = {
  'browser': function Browser() {},
  'element': function Element() {}
};

function WebDriver(options, modifier, propertiesObject = {}) {
  const scopeType = SCOPE_TYPES[propertiesObject.scope] || SCOPE_TYPES['browser'];
  delete propertiesObject.scope;
  const prototype = Object.create(scopeType.prototype);
  const log = (0, _logger.default)('webdriver');
  const eventHandler = new _events.EventEmitter();
  const EVENTHANDLER_FUNCTIONS = Object.getPrototypeOf(eventHandler);

  function unit(sessionId, commandWrapper) {
    propertiesObject.commandList = {
      value: Object.keys(propertiesObject)
    };
    propertiesObject.options = {
      value: options
    };

    if (typeof commandWrapper === 'function') {
      for (const [commandName, {
        value
      }] of Object.entries(propertiesObject)) {
        if (typeof value !== 'function') {
          continue;
        }

        propertiesObject[commandName].value = commandWrapper(commandName, value);
        propertiesObject[commandName].configurable = true;
      }
    }

    _utils.overwriteElementCommands.call(this, propertiesObject);

    propertiesObject['__propertiesObject__'] = {
      value: propertiesObject
    };
    let client = Object.create(prototype, propertiesObject);
    client.sessionId = sessionId;

    if (scopeType.name === 'Browser') {
      client.capabilities = options.capabilities;
    }

    if (typeof modifier === 'function') {
      client = modifier(client, options);
    }

    client.addCommand = function (name, func, attachToElement = false, proto, instances) {
      const customCommand = typeof commandWrapper === 'function' ? commandWrapper(name, func) : func;

      if (attachToElement) {
        if (instances) {
          Object.values(instances).forEach(instance => {
            instance.__propertiesObject__[name] = {
              value: customCommand
            };
          });
        }

        this.__propertiesObject__[name] = {
          value: customCommand
        };
      } else {
        unit.lift(name, customCommand, proto);
      }
    };

    client.overwriteCommand = function (name, func, attachToElement = false, proto, instances) {
      let customCommand = typeof commandWrapper === 'function' ? commandWrapper(name, func) : func;

      if (attachToElement) {
        if (instances) {
          Object.values(instances).forEach(instance => {
            instance.__propertiesObject__.__elementOverrides__.value[name] = customCommand;
          });
        } else {
          this.__propertiesObject__.__elementOverrides__.value[name] = customCommand;
        }
      } else if (client[name]) {
        const origCommand = client[name];
        delete client[name];
        unit.lift(name, customCommand, proto, (...args) => origCommand.apply(this, args));
      } else {
        throw new Error('overwriteCommand: no command to be overwritten: ' + name);
      }
    };

    return client;
  }

  unit.lift = function (name, func, proto, origCommand) {
    (proto || prototype)[name] = function next(...args) {
      log.info('COMMAND', (0, _utils.commandCallStructure)(name, args));
      Object.defineProperty(func, 'name', {
        value: name,
        writable: false
      });
      const result = func.apply(this, origCommand ? [origCommand, ...args] : args);
      Promise.resolve(result).then(res => {
        log.info('RESULT', res);
        this.emit('result', {
          name,
          result: res
        });
      }).catch(() => {});
      return result;
    };
  };

  for (let eventCommand in EVENTHANDLER_FUNCTIONS) {
    prototype[eventCommand] = function (...args) {
      eventHandler[eventCommand](...args);
      return this;
    };
  }

  return unit;
}