# test-port [![Build Status](https://travis-ci.org/tehsis/test-port.svg?branch=master)](https://travis-ci.org/tehsis/test-port)

Check if a given port is listening.

## Usage

`npm i test-port`

* Check if localhost is listening port 80

```js
  const test_port = require('test-port');

  test_port(80, (isWorking) => {
    if (isWorking) {
      console.log('port 80 is listening!');
    } else {
      console.log('port 80 is not listening!');
    }
  });
```

* Check if *google.com* accepts connection on port 8080.

```js

  const test_port = require('test-port');

  // Check if google.com accepts connections to port 8080
  test_port(8080, 'google.com', (isWorking) => {
    if (isWorking) {
      console.log('google.com accepts connections on port 8080')
    } else {
      console.log('google.com do not accepts connections on port 8080')
    }
  });
```

* It also returns a promise

```
  const test_port = require('test-port');

  test_port(80);
    .done(() => {
      console.log('port 80 is listening');
    })
    .catch(() => {
      console.log('port 80 is not listening');
    });
```
