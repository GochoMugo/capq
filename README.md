
# capq

> A Capped Queue for Node.js Applications

[![Build Status](https://travis-ci.org/GochoMugo/capq.svg?branch=master)](https://travis-ci.org/GochoMugo/capq) [![Coverage Status](https://coveralls.io/repos/GochoMugo/capq/badge.svg)](https://coveralls.io/r/GochoMugo/capq) [![Dependency Status](https://gemnasium.com/GochoMugo/capq.svg)](https://gemnasium.com/GochoMugo/capq)


## example:

```js
// module exports the Constructor
var Capq = require("capq");

// also this returns the same Constructor
var CapqConstructor = Capq.Capq;

// constructing a new capq
var capq = new Capq({
  capacity: 5,    // maximum length attainable
  autopop: true   // pop elements if capacity is exceeded
});

// pushing new elements
capq.rpush("a", "b", "c"); // => ["a", "b", "c"]
capq.lpush("z"); // => ["z", "a", "b", "c"]

// popping elements
var elem = capq.rpop(); // => ["c"]
elem = capq.lpop(2); // => ["z", "a"]

// check the queue's length
capq.length(); // => 1

// check if queue is empty
capq.empty(); // => false

// check if queue is full
capq.full(); // => false
```


## Installation:

```bash
⇒ npm install capq --save
```


## API:

### Capq([options])

The Constructor.

* `options` (Object):
  * `capacity` (Integer): capacity of the queue. Defaults to `5`.
  * `autopop` (Boolean): automatically pop elements if length is exceeded. Defaults to `true`. See [notes on autopop](#autopop).

To construct a new capped queue, you have to use `new`:

```js
var capq = new CapQ();
```


### capq.rpush(elements...)

Push one or more elements to the right of the queue.

* `elements...` (Any): one or more elements.

Returns an Array of the pushed elements.


### capq.lpush(elements...)

Push one or more elements to the left of the queue.

* `elements...` (Any): one or more elements.

Returns an Array of the pushed elements.


### capq.rpop([num])

Pop one or more elements from the right of the queue.

* `num` (Integer): number of elements to pop. Defaults to `1`.

Returns an Array of the popped elements. See [notes on popping](#popping).


### capq.lpop([num])

Pop one or more elements from the left of the queue.

* `num` (Integer): number of elements to pop. Defaults to `1`.

Returns an Array of the popped elements. See [notes on popping](#popping).


### capq.length()

Return an Integer representing the length of the queue i.e. the number of occupied slots.


### capq.empty()

Returns `true` if the queue is fully occupied. Otherwise, `false`.


### capq.full()

Return `true` if queue is **not** occupied at all. Otherwise, `false`.


## Notes:

<a name="autopop"></a>
### autopop: false

If `autopop` is `false`, for new elements to be successfully pushed to a filled queue, some elements have to be popped first.

**So how do you know if elements were not pushed successfully?**

All the push methods return arrays of elements successfully taken into the queue.

```js
var pushedElements = capq.rpush(1, 2, 3);

// ensure all the elements were pushed
if (pushedElements.length !== 3) {
  console.log("did NOT push some elements");
}
```

Usually the elements that are **not** successfully pushed are those positioned last in the arguments to the push method.


<a name="popping"></a>
### popping

Popping always returns an array, even when popping a single element. This way we maintain consistency, especially when the number of elements to pop is user-defined.

The available elements are returned. Say, if we had a queue with 3 elements, then popping 4 elements would return only the 3 elements.

```js
// capq is a queue with 3 elements

// popping more than available elements
var poppedElements = capq.rpop(4);

console.log(poppedElements.length); // => 3
```

Also passing an integer equal to or less than zero (`num <= 0`) to any of the popping methods will always return an empty array.


## license:

**The MIT License (MIT)**

Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>

