/**
* Benchmarking capq"s lpop method
*
* The MIT License (MIT)
* Copyright (c) 2015-2016 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// own modules
var Capq = require("../lib/capq");


// module variables
var array = [ ];
var capq = new Capq();
var length = 5;
var cycles = {
  array: 5, // a terrible hack
  capq: 5  // a terrible hack
};


// prepare
function setupCapq() {
  if (++cycles.capq >= length) {
    cycles.capq = 0;
    capq.rpush(1, 2, 3, 4, 5);
  }
}
function setupArray() {
  if (++cycles.array >= length) {
    cycles.array = 0;
    array.push(1, 2, 3, 4, 5);
  }
}
setupCapq();
setupArray();


module.exports = {
  name: "Right-Popping",
  tests: {
    "capq#rchuck": {
      onCycle: setupCapq,
      fn: function() {
        capq.rchuck();
      }
    },
    "capq#rpop (few elements)": {
      onCycle: setupCapq,
      fn: function() {
        capq.rpop();
      }
    },
    "array#pop (few elements)": {
      onCycle: setupArray,
      fn: function() {
        array.pop();
      }
    }
  }
};

