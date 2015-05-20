/**
* Benchmarking capq"s lpush method
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
capq.lpush = capq.lpush.bind(capq);
function setupCapq() {
  if (++cycles.capq === fewElements.length) {
    cycles = 0;
    capq.lpop(5);
  }
}
function setupArray() {
  if (++cycles.array === fewElements.length) {
    cycles = 0;
    array = [ ];
  }
}


module.exports = {
  name: "Left-Pushing",
  tests: {
    "capq#lpush (few elements)": {
      onCycle: setupCapq,
      fn: function() {
        capq.lpush.apply(fewElements);
      }
    },
    "array#unshift (few elements)": {
      onCycle: setupArray,
      fn: function() {
        array.unshift.apply(fewElements);
      }
    }
  }
};

