"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overwriteElementCommands = overwriteElementCommands;
exports.commandCallStructure = commandCallStructure;
exports.isValidParameter = isValidParameter;
exports.getArgumentType = getArgumentType;
exports.safeRequire = safeRequire;
exports.isFunctionAsync = isFunctionAsync;
exports.filterSpecArgs = filterSpecArgs;

function overwriteElementCommands(propertiesObject) {
  const elementOverrides = propertiesObject['__elementOverrides__'] ? propertiesObject['__elementOverrides__'].value : {};

  for (const [commandName, userDefinedCommand] of Object.entries(elementOverrides)) {
    if (typeof userDefinedCommand !== 'function') {
      throw new Error('overwriteCommand: commands be overwritten only with functions, command: ' + commandName);
    }

    if (!propertiesObject[commandName]) {
      throw new Error('overwriteCommand: no command to be overwritten: ' + commandName);
    }

    if (typeof propertiesObject[commandName].value !== 'function') {
      throw new Error('overwriteCommand: only functions can be overwritten, command: ' + commandName);
    }

    const origCommand = propertiesObject[commandName].value;
    delete propertiesObject[commandName];

    const newCommand = function (...args) {
      const element = this;
      return userDefinedCommand.apply(element, [function origCommandFunction() {
        const context = this || element;
        return origCommand.apply(context, arguments);
      }, ...args]);
    };

    propertiesObject[commandName] = {
      value: newCommand,
      configurable: true
    };
  }

  delete propertiesObject['__elementOverrides__'];
  propertiesObject['__elementOverrides__'] = {
    value: {}
  };
}

function commandCallStructure(commandName, args) {
  const callArgs = args.map(arg => {
    if (typeof arg === 'string' && (arg.startsWith('!function(') || arg.startsWith('return (function'))) {
      arg = '<fn>';
    } else if (typeof arg === 'string') {
      arg = `"${arg}"`;
    } else if (typeof arg === 'function') {
      arg = '<fn>';
    } else if (arg === null) {
      arg = 'null';
    } else if (typeof arg === 'object') {
      arg = '<object>';
    } else if (typeof arg === 'undefined') {
      arg = typeof arg;
    }

    return arg;
  }).join(', ');
  return `${commandName}(${callArgs})`;
}

function isValidParameter(arg, expectedType) {
  let shouldBeArray = false;

  if (expectedType.slice(-2) === '[]') {
    expectedType = expectedType.slice(0, -2);
    shouldBeArray = true;
  }

  if (shouldBeArray) {
    if (!Array.isArray(arg)) {
      return false;
    }
  } else {
    arg = [arg];
  }

  for (const argEntity of arg) {
    const argEntityType = getArgumentType(argEntity);

    if (!argEntityType.match(expectedType)) {
      return false;
    }
  }

  return true;
}

function getArgumentType(arg) {
  return arg === null ? 'null' : typeof arg;
}

function safeRequire(name) {
  let requirePath;

  try {
    const localNodeModules = `${process.cwd()}/node_modules`;

    if (!require.main.paths.includes(localNodeModules)) {
      require.main.paths.push(localNodeModules);

      const requireOpts = process.env.JEST_WORKER_ID ? {} : {
        paths: require.main.paths
      };
      requirePath = require.resolve(name, requireOpts);
    } else {
      requirePath = require.resolve(name);
    }
  } catch (e) {
    return null;
  }

  try {
    return require(requirePath);
  } catch (e) {
    throw new Error(`Couldn't initialise "${name}".\n${e.stack}`);
  }
}

function isFunctionAsync(fn) {
  return fn.constructor && fn.constructor.name === 'AsyncFunction' || fn.name === 'async';
}

function filterSpecArgs(args) {
  return args.filter(arg => typeof arg !== 'function');
}