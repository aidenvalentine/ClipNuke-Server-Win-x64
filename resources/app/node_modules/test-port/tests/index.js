'use strict';
const net    = require('net');
const assert = require('assert');

const test_port = require('../');

const TEST_PORT_SUCCESS = 9090;
const TEST_PORT_FAIL = 9091;
const TEST_PORT_SUCCESS_ARGS = 9092;
const TEST_PORT_SUCCESS_PROMISE = 9093;

function test_port_success () {
  let server = net.createServer();

  server.listen(TEST_PORT_SUCCESS, () => {
    test_port(TEST_PORT_SUCCESS, isWorking => {
      assert(isWorking, 'Port is listening');
      console.log(' ✓ Returns true if the port is listening.')
      server.close();
    });
  });
}

function test_port_fail () {
  test_port(TEST_PORT_FAIL, isWorking => {
    assert(!isWorking, 'Port is not listening');
    console.log(' ✓ Returns false if the port is not listening.')
  });
}

function test_hosname_arg () {
  let server = net.createServer();

  server.listen(TEST_PORT_SUCCESS_ARGS, 'localhost', () => {
    test_port(TEST_PORT_SUCCESS_ARGS, 'localhost', (isWorking) => {
      assert(isWorking, 'Port is listening');
      console.log(' ✓ will accept a hostname as a second arg.')
      server.close();
    });
  });
}

function test_no_callback () {
  assert.throws(test_port.bind(null, TEST_PORT_SUCCESS_ARGS));
  console.log(' ✓ will throw if callback is not provided.')
}

function test_external_hostname () {
  test_port(80, 'google.com', (working) => assert.ok(working, 'Can connect to port'));
  test_port(8080, 'google.com', (working) => assert.ok(!working, 'Can not connect to port'));
  console.log(' ✓ Can check external hostnames')
}

function can_resolve_promises () {
  let server = net.createServer();

  server.listen(TEST_PORT_SUCCESS_PROMISE, () => {
    test_port(TEST_PORT_SUCCESS_PROMISE)
      .then(() => {
        console.log(' ✓ can resolve promises')
        server.close();
      });
  });
}

function can_reject_promises () {
  test_port(TEST_PORT_FAIL)
    .catch(() => {
      console.log(' ✓ can reject promises')
    });
}


test_port_success();
test_port_fail();
test_hosname_arg();
test_external_hostname();
can_resolve_promises();
can_reject_promises();
