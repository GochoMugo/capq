/**
* CapQ - capped queue
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var uuid = require("node-uuid");


// module variables
var CapQ;


CapQ = (function() {
  function CapQ(options) {
    options = options || { };
    this._options = { };
    this._options.capacity = options.capacity || 5;
    this._options.autopop = typeof(options.autopop) !== "undefined" ?
      options.autopop : true;
    this._queue = [ ];
    this._lindex = 0;
    this._rindex = 0;
    this._occuppied = 0;
    this.null = uuid.v4();
    return this;
  }

  // Return `true` if queue is empty. Otherwise return `false`.
  CapQ.prototype.empty = function() {
    return this._occuppied === 0;
  };

  // Return `true` if queue is full. Otherwise return `false`.
  CapQ.prototype.full = function() {
    return this._occuppied === this._options.capacity;
  };

  // Returns the length of the queue
  CapQ.prototype.length = function() {
    return this._occuppied;
  };

  // Return `true` if an element can be pushed onto queue.
  // Otherwise return `false`.
  CapQ.prototype._pushable = function() {
    return !(this.full() && (this._options.autopop === false));
  };

  // Return values only in the acceptable range i.e. 0 - queue length
  // if val is less than 0, return 0
  // if val is greater than queue length, return queue length
  // otherwise, return `val`
  CapQ.prototype._inRange = function(val) {
    if (val < 0) {
      return 0;
    }
    if (val > this._options.capacity) {
      return this._options.capacity;
    }
    return val;
  };

  // Return index value in acceptable range
  // if val is less than 0, return max index
  // if val is greater than max index, return 0
  // otherwise, return `val`
  CapQ.prototype._loopRangeIndex = function(val) {
    if (val < 0) {
      return this._options.capacity - 1;
    }
    if (val >= this._options.capacity) {
      return 0;
    }
    return val;
  };

  // Fix an element to the right of the queue
  CapQ.prototype.rfix = function(element) {
    if (! this._pushable()) {
      return this.null;
    }
    if (this.full()) {
      this.lchuck();
    }
    if (! this.empty()) {
      this._rindex = this._loopRangeIndex(++this._rindex);
    }
    this._occuppied = this._inRange(++this._occuppied);
    this._queue[this._rindex] = element;
    return element;
  };

  // Fix an element to the left of the queue
  CapQ.prototype.lfix = function(element) {
    if (! this._pushable()) {
      return this.null;
    }
    if (this.full()) {
      this.rchuck();
    }
    if (! this.empty()) {
      this._lindex = this._loopRangeIndex(--this._lindex);
    }
    this._occuppied = this._inRange(++this._occuppied);
    this._queue[this._lindex] = element;
    return element;
  };

  // Remove an element from the right of the queue
  CapQ.prototype.rchuck = function() {
    if (this.empty()) {
      return this.null;
    }
    var element = this._queue[this._rindex];
    this._rindex = this._loopRangeIndex(--this._rindex);
    this._occuppied = this._inRange(--this._occuppied);
    return element;
  };

  // Remove an element from left of the queue
  CapQ.prototype.lchuck = function() {
    if (this.empty()) {
      return this.null;
    }
    var element = this._queue[this._lindex];
    this._lindex = this._loopRangeIndex(++this._lindex);
    this._occuppied = this._inRange(--this._occuppied);
    return element;
  };

  // Push one or more elements to the queue
  CapQ.prototype._pushArgs = function(args, pushFunc) {
    var results = [ ];
    var pushed = this.null;
    for (var i = 0; i < args.length; i++) {
      pushed = pushFunc.call(this, args[i]);
      if (pushed === this.null) {
        break;
      }
      results.push(args[i]);
    }
    return results;
  };

  // Pop one or more elements from the queue
  CapQ.prototype._popMany = function(num, popFunc) {
    var results = [ ];
    var temp = this.null;
    num = typeof(num) !== "undefined" ? num : 1;
    while (num > 0) {
      temp = popFunc.call(this);
      if (temp === this.null) {
        break;
      }
      results.push(temp);
      num--;
    }
    return results;
  };

  // Right-Push
  CapQ.prototype.rpush = function() {
    return this._pushArgs(arguments, this.rfix);
  };

  // Left-Push
  CapQ.prototype.lpush = function() {
    return this._pushArgs(arguments, this.lfix);
  };

  // Right-Pop
  CapQ.prototype.rpop = function(num) {
    return this._popMany(num, this.rchuck);
  };

  // Left-Pop
  CapQ.prototype.lpop = function(num) {
    return this._popMany(num, this.lchuck);
  };

  // Return  constructor
  return CapQ;

})();


// module as a constructor
exports = module.exports = CapQ;


// module method as a constructor
exports.CapQ = CapQ;
exports.Capq = CapQ;

