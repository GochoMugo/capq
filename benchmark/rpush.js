/**
* Benchmarking capq"s rpush method
*
* The MIT License (MIT)
* Copyright (c) 2015-2016 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// own modules
var Capq = require("../lib/capq");


// module variables
var fewElements = [1, 2, 3, 4, 5];
var array = [ ];
var capq = new Capq();
var cycles = {
  array: 0,
  capq: 0
};


// prepare
function setupCapq() {
  if (++cycles.capq >= fewElements.length) {
    cycles.capq = 0;
    capq.rpop(5);
  }
}
function setupArray() {
  if (++cycles.array >= fewElements.length) {
    cycles.array = 0;
    array = [ ];
  }
}

module.exports = {
  name: "Right-Pushing",
  tests: {
    "capq#rfix": {
      onCycle: setupCapq,
      fn: function() {
        capq.rfix.apply(capq, [1]);
      }
    },
    "capq#rpush (few elements)": {
      onCycle: setupCapq,
      fn: function() {
        capq.rpush.apply(capq, fewElements);
      }
    },
    "array#push (few elements)": {
      onCycle: setupArray,
      fn: function() {
        array.push.apply(array, fewElements);
      }
    }
  }
};

