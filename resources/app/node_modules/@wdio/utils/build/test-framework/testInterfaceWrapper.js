"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTestInFiberContext = exports.wrapTestFunction = exports.runSpec = exports.runHook = void 0;

var _utils = require("../utils");

var _testFnWrapper = require("./testFnWrapper");

const MOCHA_COMMANDS = ['skip', 'only'];

const runHook = function (hookFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest) {
  return origFn(function (...hookFnArgs) {
    return _testFnWrapper.testFnWrapper.call(this, 'Hook', {
      specFn: hookFn,
      specFnArgs: (0, _utils.filterSpecArgs)(hookFnArgs)
    }, {
      beforeFn,
      beforeFnArgs
    }, {
      afterFn,
      afterFnArgs
    }, cid, repeatTest);
  });
};

exports.runHook = runHook;

const runSpec = function (specTitle, specFn, origFn, beforeFn, beforeFnArgs, afterFn, afterFnArgs, cid, repeatTest) {
  return origFn(specTitle, function (...specFnArgs) {
    return _testFnWrapper.testFnWrapper.call(this, 'Test', {
      specFn,
      specFnArgs: (0, _utils.filterSpecArgs)(specFnArgs)
    }, {
      beforeFn,
      beforeFnArgs
    }, {
      afterFn,
      afterFnArgs
    }, cid, repeatTest);
  });
};

exports.runSpec = runSpec;

const wrapTestFunction = function (origFn, isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid) {
  return function (...specArguments) {
    let retryCnt = typeof specArguments[specArguments.length - 1] === 'number' ? specArguments.pop() : 0;
    const specFn = typeof specArguments[0] === 'function' ? specArguments.shift() : typeof specArguments[1] === 'function' ? specArguments.pop() : undefined;
    const specTitle = specArguments[0];

    if (isSpec) {
      if (specFn) return runSpec(specTitle, specFn, origFn, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid, retryCnt);
      return origFn(specTitle);
    }

    return runHook(specFn, origFn, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid, retryCnt);
  };
};

exports.wrapTestFunction = wrapTestFunction;

const runTestInFiberContext = function (isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, fnName, cid, scope = global) {
  const origFn = scope[fnName];
  scope[fnName] = wrapTestFunction(origFn, isSpec, beforeFn, beforeArgsFn, afterFn, afterArgsFn, cid);
  addMochaCommands(origFn, scope[fnName]);
};

exports.runTestInFiberContext = runTestInFiberContext;

function addMochaCommands(origFn, newFn) {
  MOCHA_COMMANDS.forEach(commandName => {
    if (typeof origFn[commandName] === 'function') {
      newFn[commandName] = origFn[commandName];
    }
  });
}