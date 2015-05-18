/**
* Testing the CapQ
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// npm-installed modules
var should = require("should");


// own modules
var CapQ = require("../lib/capq");


describe("module", function() {
  it("exports a constructor function", function() {
    should(CapQ).be.a.Function;
  });

  it("exports constructor function off CapQ.CapQ", function() {
    should(CapQ.CapQ).be.a.Function;
    should(CapQ.CapQ).eql(CapQ);
  });
});


describe("CapQ constructor", function() {
  it("returns capq object, without options", function() {
    should(new CapQ()).be.an.Object;
  });

  it("accepts options", function() {
    var options = { autopop: true, capacity: 5 };
    should(new CapQ(options)).be.an.Object;
  });
});


describe("CapQ constructor options", function() {
  describe("autopop", function() {
    it("=== true", function() {
      var capq = new CapQ({ autopop: true, capacity: 3 });
      capq.rpush(1, 2, 3);
      should(capq.full()).be.ok;
      should(capq.rpush(4)).eql([4]);
      should(capq.lpop(3)).eql([2, 3, 4]);
    });

    it("=== false", function() {
      var capq = new CapQ({ autopop: false, capacity: 3 });
      capq.rpush(1, 2, 3);
      should(capq.full()).be.ok;
      should(capq.rpush(4)).eql([]);
      should(capq.lpop(3)).eql([1, 2, 3]);
    });
  });

  describe("capacity", function() {
    it("defines capacity of queue", function() {
      var capq = new CapQ({ capacity: 3 });
      should(capq.empty()).eql(true);
      capq.rpush(1, 2, 3);
      should(capq.full()).eql(true);
    });
  });
});


describe("capq.empty", function() {
  it("returns true if queue has no element", function() {
    var capq = new CapQ();
    should(capq.empty()).eql(true);
  });

  it("returns false if queue has one or more element", function() {
    var capq = new CapQ();
    capq.rpush(1);
    should(capq.empty()).eql(false);
  });
});


describe("capq.full", function() {
  it("returns true if queue is filled", function() {
    var capq = new CapQ({ capacity: 3 });
    capq.rpush(1, 2, 3);
    should(capq.full()).eql(true);
  });

  it("returns false if queue has one or more free slots", function() {
    var capq = new CapQ({ capacity: 3 });
    should(capq.full()).eql(false);
  });
});


describe("capq.length", function() {
  it("returns zero when queue is empty", function() {
    var capq = new CapQ({ capacity: 3 });
    should(capq.length()).eql(0);
  });

  it("returns length of queue", function() {
    var capq = new CapQ({ capacity: 3 });
    capq.rpush("a", "b");
    should(capq.length()).eql(2);
    capq.rpush("c");
    should(capq.length()).eql(3);
  });

  it("never exceeds capacity of queue", function() {
    var capq = new CapQ({ capacity: 3 });
    capq.rpush("a", "b", "c", "d", "e");
    should(capq.length()).eql(3);
  });
});


describe("capq.rpush", function() {
  it("pushes to right of queue", function() {
    var capq = new CapQ();
    capq.rpush(1, 2);
    capq.rpush(3);
    should(capq.lpop(3)).eql([1, 2, 3]);
  });

  it("has no effect if no args is passed", function() {
    var capq = new CapQ({ capacity: 3, autopop: true });
    capq.rpush(1, 2, 3);
    capq.rpush();
    should(capq.lpop(3)).eql([1, 2, 3]);
  });
});


describe("capq.lpush", function() {
  it("pushes to left of queue", function() {
    var capq = new CapQ();
    capq.rpush(1, 2);
    capq.lpush(3);
    should(capq.lpop(3)).eql([3, 1, 2]);
  });

  it("has no effect if no args is passed", function() {
    var capq = new CapQ({ capacity: 3, autopop: true });
    capq.lpush(1, 2, 3);
    capq.lpush();
    should(capq.rpop(3)).eql([1, 2, 3]);
  });
});


describe("capq.rpop", function() {
  it("pops elements from right of queue", function() {
    var capq = new CapQ();
    capq.rpush(1, 2, 3);
    should(capq.rpop(3)).eql([3, 2, 1]);
  });

  it("num of elems to pop is optional", function() {
    var capq = new CapQ();
    capq.rpush(1);
    should(function(){ capq.rpop() }).not.throw();
  });

  it("returns empty array if queue is empty", function() {
    var capq = new CapQ();
    should(capq.empty()).eql(true);
    should(capq.rpop()).eql([]);
  });

  it("returns empty array if num is zero", function() {
    var capq = new CapQ();
    capq.rpush(99);
    should(capq.rpop(0)).eql([]);
  });

  it("returns empty array if num is less than zero", function() {
    var capq = new CapQ();
    capq.rpush(99);
    should(capq.rpop(-1)).eql([]);
  });
});


describe("capq.lpop", function() {
  it("pops elements from left of queue", function() {
    var capq = new CapQ();
    capq.rpush(1, 2, 3);
    should(capq.lpop(3)).eql([1, 2, 3]);
  });

  it("num of elems to pop is optional", function() {
    var capq = new CapQ();
    should(function() { capq.lpop() }).not.throw();
  });

  it("returns empty array if queue is empty", function() {
    var capq = new CapQ();
    should(capq.empty()).eql(true);
    should(capq.lpop()).eql([]);
  });

  it("returns empty array if num is zero", function() {
    var capq = new CapQ();
    capq.lpush(99);
    should(capq.lpop(0)).eql([]);
  });

  it("returns empty array if num is less than zero", function() {
    var capq = new CapQ();
    capq.lpush(99);
    should(capq.lpop(-1)).eql([]);
  });
});


describe("complex pushs/pops", function() {
  describe("left.index right of right.index", function() {
    var capq;

    beforeEach(function() {
      capq = new CapQ({ capacity: 5 });
      // [1, 2, X, 100, 99]
      //     ^      ^
      //    r.i    l.i
      capq.rpush(1, 2);
      capq.lpush(99, 100);
    });

    it("make left.index by-pass right.index", function() {
      capq.lpush("a", "b");
      should(capq.rpop()).eql([1]);
    });

    it("make right.index by-pass left.index", function() {
      capq.rpush("a", "b");
      should(capq.lpop()).eql([99]);
    });
  });

});

