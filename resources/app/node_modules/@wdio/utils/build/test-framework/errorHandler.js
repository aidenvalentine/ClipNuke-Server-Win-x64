"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logHookError = void 0;

const logHookError = (hookName, hookResults = [], cid) => {
  const result = hookResults.find(result => result instanceof Error);

  if (typeof result === 'undefined') {
    return;
  }

  const error = {
    message: result.message
  };
  const content = {
    cid: cid,
    error: error,
    fullTitle: `${hookName} Hook`,
    type: 'hook',
    state: 'fail'
  };
  process.send({
    origin: 'reporter',
    name: 'printFailureMessage',
    content
  });
};

exports.logHookError = logHookError;