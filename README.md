
# capq

> A Simple Capped Queue for Node.js Applications

[![Build Status](https://travis-ci.org/GochoMugo/capq.svg?branch=master)](https://travis-ci.org/GochoMugo/capq) [![Coverage Status](https://coveralls.io/repos/GochoMugo/capq/badge.svg)](https://coveralls.io/r/GochoMugo/capq) [![Dependency Status](https://gemnasium.com/GochoMugo/capq.svg)](https://gemnasium.com/GochoMugo/capq)


## example:

```js
// module exports the Constructor
var Capq = require("capq");

// also this returns the same Constructor
var CapqConstructor2 = Capq.CapQ;

// and also this one, for lazy typers
var CapqConstructor3 = Capq.Capq;

// constructing a new capq
var capq = new Capq({
  capacity: 5,    // maximum length attainable
  autopop: true   // pop elements if capacity is exceeded
});

// pushing 1 element
capq.lfix("a"); // fixes element to the left i.e. ["a"]
capq.rfix("z"); // fixes element to the right i.e. ["a", "z"]

// pushing one or more elements. Works by
// fixing the arguments one after the other
capq.lpush(1, 2); // i.e. [2, 1, "a", "z"]
capq.rpush(99, 100); // i.e. [2, 1, "a", "z", 99, 100]

// popping 1 element
capq.lchuck(); // remove element from left i.e. 2
capq.rchuck(); // remove element from right i.e. 100

// popping more than one elements. Works by
// chucking the arguments one after the other
capq.rpop(2); // => ["z", 99]
capq.lpop(2); // => [1, "a"]

// check the queue's length
capq.length(); // => 0

// check if queue is empty
capq.empty(); // => true

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
var capq = new Capq();
```


### capq.lfix(element)

Push the element to the left of the queue.

* `element` (Any): one element

Returns `element` if pushed successfully. Otherwise `capq.null`.


### capq.rfix(element)

Push the element to the right of the queue.

* `element` (Any): one element

Returns `element` if pushed successfully. Otherwise `capq.null`.


### capq.lpush(elements...)

Push one or more elements to the left of the queue.

* `elements...` (Any): one or more elements.

Returns an Array of the pushed elements.


### capq.rpush(elements...)

Push one or more elements to the right of the queue.

* `elements...` (Any): one or more elements.

Returns an Array of the pushed elements.


### capq.lchuck()

Removes one element from the left of the queue.

Returns the removed element if chucked successfully. Otherwise `capq.null`.


### capq.rchuck()

Removes one element from the right of the queue.

Returns the removed element if chucked successfully. Otherwise `capq.null`.


### capq.lpop([num])

Pop one or more elements from the left of the queue.

* `num` (Integer): number of elements to pop. Defaults to `1`.

Returns an Array of the popped elements. See [notes on popping](#popping).


### capq.rpop([num])

Pop one or more elements from the right of the queue.

* `num` (Integer): number of elements to pop. Defaults to `1`.

Returns an Array of the popped elements. See [notes on popping](#popping).


### capq.length()

Return an Integer representing the length of the queue i.e. the number of occupied slots.


### capq.empty()

Returns `true` if queue is **not** occupied at all. Otherwise, `false`.


### capq.full()

Returns `true` if the queue is fully occupied. Otherwise, `false`.


## Notes:

<a name="autopop"></a>
### autopop: false

If `autopop` is set to `false`, for new elements to be successfully pushed to a **filled** queue, some elements have to be popped first.

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


<a name="null"></a>
### capq.null

This is a unique ID used by a queue to represent `null`.

**Why don't you just use `null` internally?**

Using `null` or `undefined` would make it almost impossible to allow adding the values `null` and `undefined` to the queue. By having a universally-unique ID as our `null` we can allow any value to be added to our queue.

```js
// assuming `capq` is an empty Capq instance
capq.empty(); // => true
var elem = capq.lchuck();
if (elem === capq.null) {
  console.log("element not found");
}
```

**Note:** `capq.null` is unique from one instance to another.


<a name="performance"></a>
### performance

```
Running suite Left-Popping [benchmark/lpop.js]...
>> capq#lchuck x 77,975,574 ops/sec ±0.34% (99 runs sampled)
>> capq#lpop (few elements) x 39,435,959 ops/sec ±0.40% (103 runs sampled)
>> array#shift (few elements) x 80,104,297 ops/sec ±0.38% (97 runs sampled)
Fastest test is array#shift (few elements) at 1.03x faster than capq#lchuck

Running suite Left-Pushing [benchmark/lpush.js]...
>> capq#lfix x 14,935,842 ops/sec ±1.06% (100 runs sampled)
>> capq#lpush (few elements) x 3,310,143 ops/sec ±0.36% (102 runs sampled)
>> array#unshift (few elements) x 6,607 ops/sec ±77.14% (6 runs sampled)
Fastest test is capq#lfix at 4.5x faster than capq#lpush (few elements)

Running suite Right-Popping [benchmark/rpop.js]...
>> capq#rchuck x 75,136,548 ops/sec ±0.90% (98 runs sampled)
>> capq#rpop (few elements) x 37,419,377 ops/sec ±0.88% (96 runs sampled)
>> array#pop (few elements) x 75,252,494 ops/sec ±2.01% (94 runs sampled)
Fastest test is capq#rchuck at 1.00x faster than array#pop (few elements)

Running suite Right-Pushing [benchmark/rpush.js]...
>> capq#rfix x 13,832,352 ops/sec ±1.24% (95 runs sampled)
>> capq#rpush (few elements) x 3,249,224 ops/sec ±1.33% (95 runs sampled)
>> array#push (few elements) x 4,031,188 ops/sec ±4.88% (69 runs sampled)
Fastest test is capq#rfix at 3.4x faster than array#push (few elements)

```

From this data, we can conclude:

* `lfix` should be used in favour of `lpush`
* `rfix` should be used in favour of `rpush`
* `lchuck` should be used in favour of `lpop`
* `rchuck` should be used in favour of `rpop`
* the wrapping around array methods (`array#push`, `array#pop`, etc.) to make up the above methods may cost us performance
* do **NOT** use a capped queue in a performance-sensitive application where a simple array will suffice

To run these tests on your own:

```bash
⇒ git clone https://github.com/GochoMugo/capq
⇒ cd capq
⇒ npm install
⇒ grunt test # runs unit tests and benchmarks
⇒ grunt benchmark # runs only benchmarks
```

> Please help me ensure these benchmarks are significantly true (by running, reviewing and designing). Benchmarks have been placed in `benchmark/` directory.


<a name="memory"></a>
### memory

A capped queue uses an underlying array with a maximum length of the defined capacity. No matter how many elements you add and remove from the queue, the array size remains the same (if all the elements added and removed are of the same type, of course).

The underlying array does **not** grow (only grows the first time its pushed to capacity) and shrink. No slicing occurs at any time. **This is by design**: by using iterators we can ensure the array length is constant. These iterators define the order of the elements, and not the positions in the array.

However, when removing elements from the queue, the memory occuppied by such elements is not reclaimed. Freeing these memory spaces would cost us more performance.


## license:

**The MIT License (MIT)**

Copyright (c) 2015-2016 GochoMugo <mugo@forfuture.co.ke>

