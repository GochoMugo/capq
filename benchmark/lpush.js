/**
* Benchmarking capq"s lpush method
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
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
    capq.lpop(5);
  }
}
function setupArray() {
  if (++cycles.array >= fewElements.length) {
    cycles.array = 0;
    array = [ ];
  }
}


module.exports = {
  name: "Left-Pushing",
  tests: {
    "capq#lfix": {
      onCycle: setupCapq,
      fn: function() {
        capq.lfix.apply(capq, [1]);
      }
    },
    "capq#lpush (few elements)": {
      onCycle: setupCapq,
      fn: function() {
        capq.lpush.apply(capq, fewElements);
      }
    },
    "array#unshift (few elements)": {
      onCycle: setupArray,
      fn: function() {
        array.unshift.apply(array, fewElements);
      }
    }
  }
};

