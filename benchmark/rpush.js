/**
* Benchmarking capq"s rpush method
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


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
capq.rpush = capq.rpush.bind(capq);
function setupCapq() {
  if (++cycles.capq === fewElements.length) {
    cycles = 0;
    capq.rpop(5);
  }
}
function setupArray() {
  if (++cycles.array === fewElements.length) {
    cycles = 0;
    array = [ ];
  }
}

module.exports = {
  name: "Right-Pushing",
  tests: {
    "capq#rpush (few elements)": {
      onCycle: setupCapq,
      fn: function() {
      capq.rpush.apply(fewElements);
      }
    },
    "array#push (few elements)": {
      onCycle: setupArray,
      fn: function() {
        array.push.apply(fewElements);
      }
    }
  }
};

