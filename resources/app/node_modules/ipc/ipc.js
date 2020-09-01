/**
 * ipc.js
 *
 * Handles simple Interprocess (server) communication between multiple instances of
 * an application, allowing voting to determine the master process.
 *
 * Released under the MIT License (MIT)
 * Copyright (c) 2012 Paris Stamatopoulos
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var redis = require('redis');
var winston = require('winston');
var events = require('events');
var util = require('util');
var async = require('async');

var PackerEnum = {
  JSON : 1
};

var Defaults = {
  pid              : process.pid,
  packer           : PackerEnum.JSON,
  electionInterval : 60000
};

var Ipc = function( serverId, options ) {
  var self = this;

  events.EventEmitter.call(this);

  /**
   * The current options
   *
   * @var array
   */
  this._options = (options) ? (Defaults.extend(options)) : Defaults;

  /**
   * The redis client
   *
   * @var redis
   */
  this._redis = redis.createClient();

  /**
   * The redis client for the IPC
   *
   * @var redis
   */
  this._subscriber = redis.createClient();

  /**
   * The server id of this server process
   *
   * @var string
   */
  this._serverId = serverId;

  /**
   * The sent votes for the Bully algorithm
   *
   * @var array
   */
  this._sentVotes = [];

  /**
   * The bully timeout reference for the setTimeout
   * section, that terminates an election
   *
   * @var array
   */
  this._bullyTimeout = [];

  /**
   * The last result of the election
   *
   * @var array
   */
  this._lastResult = [];

  /**
   * The election interval reference
   *
   * @var array
   */
  this._electionInterval = [];

  // Channel used for inter process communication
  this._subscriber.subscribe( 'ipc::comm:'  + this._serverId );

  // Channel used for process elections
  this._subscriber.subscribe( 'ipc::bully:' + this._serverId );

  // Channel used for public messages
  this._subscriber.subscribe( 'ipc::public' );

  this._subscriber.on('message', function( channel, message ) {
    try {
      var message = self._unpack(message);
    } catch( error ) {
      winston.error("ipc: Unable to process recieved message. Ignoring");
      return;
    }

    // Election message
    if( channel == 'ipc::bully:' + self._serverId ) {
      self._handleElectionMessage(message);
    }
    else {
      /*
      if( message.event !== undefined ) {
        var ev = message.event;

        delete message['event'];
        self.emit(ev, message);
      }
      else
      */
      self.emit('message', message);
    }
  });
};

util.inherits(Ipc, events.EventEmitter);

/**
 * Send a message to a server
 *
 * @param string serverId The server id of the server to send the message
 * @param object message The message to send to the server
 * @param function fn The callback function (Optional)
 */
Ipc.prototype.sendMessage = function( serverId, message, fn ) {
  this._redis.publish( 'ipc::comm:' + serverId, this._pack(message), function( error, result ) {
    fn && fn(error, result);
  });
};

/**
 * Send a message to all servers
 *
 * @param object message The message to send to the server
 * @param function fn The callback function
 */
Ipc.prototype.sendMessageToAll = function( message, fn ) {
  this._redis.publish( 'ipc::public', this._pack(message), function(error, result) {
    fn && fn(error, result);
  });
};

/**
 * Implements the Bully algorithm so that the processes can vote on issues
 * and decide on who is going to run certain functions of the server. The election
 * eventually will emit 'win', or 'lose' depending on the previous election status
 * (will not emit if the status of the previous election is the same as this one)
 *
 * @param string election The name of the election to run
 */
Ipc.prototype._startElections = function( election ) {
  var self = this;

  if( !election ) {
    election = 'default';
  }

  if( !this._sentVotes[election] ) {
    this._sentVotes[election] = [];
  }
  async.series([
    function( callback ) {
      self._redis.smembers( 'ipc::election:' + election + ':candidates', function( error, result ) {
        if( error || !result ) {
          winston.error("Unable to get information for the servers participating in the election");

          callback("Unable to get information about the servers running");
          return;
        }

        result.forEach( function( serverId, serverNum ) {
          self._redis.hget( 'ipc::server:details', serverId, function( error, details ) {
            try {
              var data = self._unpack( details );
            } catch( error ) {
              winston.debug("bully: Found junk data in the servers pool. Ignoring");
              return;
            }

            if( data === undefined || data == null ) {
              winston.debug("bully: Found a candidate with no server details. Ignore him");
              return;
            }

            if( self._options.pid == data.process ) {
              // This is me, don't mind me
              if( serverNum == result.length - 1 ) {
                callback && callback(null);
              }

              return;
            }

            self._sentVotes[election].push(serverId);

            self._redis.publish(
              'ipc::bully:' + serverId,
              JSON.stringify({
                type     : 'vote',
                election : election,
                me       : self._options.pid,
                id       : self._serverId
              }), function( error, pResult ) {
                if( !pResult ) {
                  winston.error("bully: Server with process " + data.process + " appears to be offline. Cleaning up");

                  // Should the emit be sent to the winner only?
                  self.emit('dead', {
                    process:	data.process,
                    id:		serverId
                  });

                  self.markProcessOffline( serverId );

                  var pos = self._sentVotes[election].indexOf(serverId);

                  if( pos != -1 ) {
                    self._sentVotes[election].splice(pos,1);
                  }
                }
                else {
                  winston.debug("bully: Sent vote message to server " + serverId);
                }

                if( serverNum == result.length - 1) {
                  callback && callback(null);
                }
            });
          });
        });
      });
    },
    function( callback ) {
      winston.debug("bully: Finished sending votes to all alive members of the cluster");

      self._bullyTimeout[election] = setTimeout(function() {
        if( self._sentVotes[election].length == 0 ) {
          winston.debug("bully: Vote timeout has ended for election " + election + ". It looks like I am the winner. Hooray!");

          if( self._lastResult[election] != 1 ) {
            self.emit('won');
          }

          self._lastResult[election] = 1;
        }
        else {
          //console.log(self._sentVotes[election]);
          winston.debug("bully: Election " + election + " appears to be non conclusive. Try again later");

          self._sentVotes[election] = [];
          self._lastResult[election] = -1;

          return;
        }
      }, 10000);
    }
  ]);
};

/**
 * Mark the process as being a candidate for the elections. This will start a new
 * round of elections until the process quitElection().
 *
 * @param string election The election to run for
 */
Ipc.prototype.runForPresident = function( election ) {
  var self = this;

  if( !election ) {
    election = 'default';
  }

  this._redis.multi()
    .sadd( 'ipc::election:' + this._serverId + ':participated', election )
    .sadd( 'ipc::election:' + election + ':candidates', this._serverId )
    .exec( function( error, result ) {
      if( !error ) {
        winston.debug("ipc:: Starting elections for election " + election);
        self._startElections(election);

        self._electionInterval[election] = setInterval(function() {
          self._startElections(election);
        }, self._options.electionInterval);
      }
      else {
        winston.error("ipc: Unable to add process as a candidate for elections for " + election);
      }
    });
};

/**
 * Removes the process from the candidates for the elections. This will stop
 * all elections initiated from this process
 *
 * @param string election The election to quit
 */
Ipc.prototype.quitElection = function( election ) {
  var self = this;

  if( !election ) {
    election = 'default';
  }

  if( this._electionInterval[election] !== undefined ) {
    this._redis.multi()
      .srem( 'ipc::election:' + this._serverId + ':participated', election )
      .srem( 'ipc::election:' + election + ':candidates', this._serverId )
      .exec( function( error, result ) {
        if( !error ) {
          clearInterval(self._electionInterval[election]);
          delete self._electionInterval[election];
        }
        else {
          winston.error("ipc: Unable to remove process from election candidates for election " + election);
        }
      });
  }
  else {
    winston.info("ipc: Process is not a candidate for election " + election);
  }
};

/**
 * Handles the responses from the Bully election replying back to the initiator of the election
 *
 * @param object message The message received
 */
Ipc.prototype._handleElectionMessage = function( message ) {
  var self = this;

  switch( message.type ) {
    case 'vote':
      if( message.me > this._options.pid ) {
        winston.debug("bully: Received vote message from server " + message.id + " (PID: " + message.me
                        + ") while I have pid " + this._options.pid + " for election " + message.election + ". I must obey");

        this._redis.publish(
          'ipc::bully:' + message.id,
          this._pack({
            type     : 'voteack',
            me       : this._options.pid,
            id       : this._serverId,
            election : message.election
          }),
          function( error, result ) {
            if( self._lastResult[message.election] != 0 ) {
              self.emit('lost');
            }

            self._lastResult[message.election] = 0;

            if( self._bullyTimeout[message.election] ) {
              clearTimeout(self._bullyTimeout[message.election]);
            }
          });
      }
      else if( message.me < this._options.pid ) {
        winston.debug("bully: Received vote message from server " + message.id + " (PID: " + message.me
                        + ") while I have pid " + this._options.pid + " for election " + message.election + ". Tough luck");

        this._redis.publish(
          'ipc::bully:' + message.id,
          this._pack({
            type     : 'votekick',
            me       : this._options.pid,
            id       : this._serverId,
            election : message.election
          }),
          function( error, result ) {
          });
      }
    break;
    case 'voteack':
      var pos = this._sentVotes[message.election].indexOf(message.id);

      if( pos != -1 ) {
        this._sentVotes[message.election].splice(pos,1);
      }

      winston.debug("bully: Received voteack from server " + message.id + " (PID: " + message.me
                      + ") for election " + message.election + ". Another one bites the dust");

    break;
    case 'votekick':
      winston.debug("bully: Received votekick from server " + message.id + " (PID: " + message.me
                      + ") for election " + message.election + ". Shame on me for trying to become the king.");

      this._sentVotes[message.election] = [];

      if( self._lastResult[message.election] != 0 ) {
        this.emit('lost');
      }

      self._lastResult[message.election] = 0;

      clearTimeout(self._bullyTimeout[message.election]);
    break;
  }
};

/**
 * Get the status of the last election
 *
 * @param string election The election to get the status of
 *
 * @return int
 */
Ipc.prototype.getLastStatus = function( election ) {
  return self._lastResult[election];
};

/**
 * Mark the process as being online on the system
 *
 */
Ipc.prototype.markProcessOnline = function( fn ) {
  var self = this;

  var _markOnline = function() {
    self._redis.multi()
      .sadd( 'ipc::server:list', self._serverId )
      .hset( 'ipc::server:details', self._serverId, self._pack({
        process:        self._options.pid,
        timestamp:      new Date()
      }))
      .exec(function( error, result ) {
        fn && fn();
      });
  };

  this._redis.sismember( 'ipc::server:list', this._serverId, function(error, result) {
    if( result ) {
      winston.info("ipc: Found a server with the same server id (" + self._serverId + "). Overwriting...");

      self.markProcessOffline( self._serverId, function() {
        _markOnline();
      });
    }
    else {
      _markOnline();
    }
  });
};

/**
 * Mark the process as being offline on the system
 *
 * @param string serverId Optional
 * @param function fn
 */
Ipc.prototype.markProcessOffline = function( serverId, fn ) {
  var self = this;

  this._redis.multi()
    .srem( 'ipc::server:list', serverId || this._serverId )
    .hdel( 'ipc::server:details', serverId || this._serverId )
    .exec( function( error, result ) {
      self._removeParticipantFromAllElections(serverId, function() {
        fn && fn();
      });
    });
};

/**
 * Remove a participart from all the elections he is a part of
 *
 * @param int serverId The serverId to remove
 * @param function fn
 */
Ipc.prototype._removeParticipantFromAllElections = function( serverId, fn ) {
  var self = this;

  this._redis.smembers( 'ipc::election:' + serverId + ':participated', function( error, result ) {
    if( error && !result ) {
      winston.error("Unable to get list of elections this server has participated");
      fn && fn(error);
      return;
    }

    result.forEach(function(election, index) {
      self._redis.srem( 'ipc::election:' + election + ':candidates', serverId, function(error) {
        if( error ) {
          winston.error("Unable to remove candidate " + serverId + " from election " + election);
          return;
        }
      });

      if( index == result.length - 1) {
        fn && fn(null);
      }
    });
  });
};

/**
 * Store the winner of the election
 *
 */
Ipc.prototype._markMeAsWinner = function() {
  this._redis.set('ipc::election:winner', this._pack( { serverId: this._serverId, pid: this._options.pid }));
};

/**
 * Get winner of the election
 *
 * @param function fn The callback function
 */
Ipc.prototype.getCurrentWinner = function( fn ) {
  this._redis.get('ipc::election:winner', function(error, result) {
    fn && fn(error, result);
  });
};

/**
 * Get server process details
 *
 * @param string serverId The server id to retrieve the details of
 * @param function callback The callback function
 */
Ipc.prototype.getProcessDetails = function( serverId, callback ) {
  var self = this;

  this._redis.hget( 'ipc::server:details', serverId, function( error, result ) {
    if( error ) {
      callback(error);
    }
    else {
      try {
        var details = self._unpack(result);
      } catch( error ) {
        callback("Unable to parse process details. Not in JSON");
        return;
      }

      callback(null, details);
    }
  });
};

/**
 * Pack a message
 *
 * @todo Add msgpack?
 * @param object message
 */
Ipc.prototype._pack = function( message ) {
  switch( this._options.packer ) {
    case PackerEnum.JSON:
      return JSON.stringify(message);
    default:
      throw "Unable to pack message. Invalid packer specified";
  }
};

/**
 * Unpack a message
 *
 * @todo Add msgpack?
 * @param object message
 */
Ipc.prototype._unpack = function( message ) {
  switch( this._options.packer ) {
    case PackerEnum.JSON:
     return JSON.parse(message);
    default:
      throw "Unable to unpack message. Invalid packer specified";
  }
};

module.exports = Ipc;

