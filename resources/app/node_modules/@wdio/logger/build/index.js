"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

let mode = require('./web').default;

if (typeof process !== 'undefined' && typeof process.release !== 'undefined' && process.release.name === 'node') {
  const nodeMode = './node';
  mode = require(nodeMode).default;
}

var _default = mode;
exports.default = _default;