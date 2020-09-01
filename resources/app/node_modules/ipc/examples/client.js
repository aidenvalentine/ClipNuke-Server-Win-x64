#!/usr/bin/env node

var Ipc = require('../ipc.js');

if( process.argv.length != 3 ) {
  console.log("Please specify the server id");
  process.exit();
}

var serverId = process.argv[2];
var ipc = new Ipc(serverId);

// Mark the process to be online in the cluster
ipc.markProcessOnline( function() {
  // Now that we are online we will run for president
  ipc.runForPresident();
});

// 'won' event is emited if we win (daaah) the elections
ipc.on('won', function() {
  console.log("Wow...I've won! I'd like to thank all of you for the support");
});

// 'lost' ... Well you get it
ipc.on('lost', function() {
  console.log("I've lost...You low life scum bag...");
});

// 'dead' event is emited when a dead node has been detected. The IPC library
// is responsible for cleaning up the cluster while you clean up your application
ipc.on('dead', function( data ) {
  console.log("Found a dead server...Let's clean him up", data);
});

// A message has arrived for me...
ipc.on('message', function(data) {
  console.log(data);
});
