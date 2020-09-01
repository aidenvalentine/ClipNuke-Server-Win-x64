Node.js Inter-process communication and election library.

node-ipc implements the Bully algorithm (http://en.wikipedia.org/wiki/Bully_algorithm) making it 
possible for multiple instances of the same application to elect a master process and at the same 
time allow for messages to be send across the live instances

Makes use of the redis PUB/SUB featureset.

This should probably be called a work-in-progress.

Checkout examples/client.js for a simple example

Requires winston, async, redis libraries.
