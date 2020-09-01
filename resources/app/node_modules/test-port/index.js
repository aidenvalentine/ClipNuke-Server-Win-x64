'use strict';

const net = require('net');

function resolveorcb (cb, defer, resolved) {
  if (cb) {
    return cb(resolved);
  }

  return defer[resolved ? 'resolve' : 'reject']();
}

module.exports = function test_port (port, host, cb) {
  let defer = Promise.defer();

  cb = cb || host;
  host = typeof host === 'string' ? host : undefined;

  let tester = net.createConnection({port, host});

  tester.on('error', () => {
    tester.destroy();
    resolveorcb(cb, defer, false);
  });

  tester.on('timeout', () => {
    tester.destroy();
    resolveorcb(cb, defer, false);
  });

  tester.setTimeout(2000);

  tester.on('connect', () => {
    tester.destroy();
    resolveorcb(cb, defer, true);
  });

  return defer.promise;
}

