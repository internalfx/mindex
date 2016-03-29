
# Mindex

A small simple javascript compound index that borrows heavily from LokiJS.

Useful for finding objects in collections, Mindex is able to search huge arrays of data almost instantly. It can return ranges of the data, and the results are always sorted. It also has a very intuitive query syntax and even supports `skip` and `offset` so you can quickly paginate results.

Mindex makes finding information fast.

### Features

- **Small** - Under 300 lines of code.
- **Fast** - Records can be found in O(log n) time.
- **Powerful** - Supports compound keys and allows for a simple query syntax.

[![npm version](https://img.shields.io/npm/v/mindex.svg)](https://www.npmjs.com/package/mindex) [![license](https://img.shields.io/npm/l/mindex.svg)](https://github.com/internalfx/mindex/blob/master/LICENSE) [![Build Status](https://travis-ci.org/internalfx/mindex.svg?branch=master)](https://travis-ci.org/internalfx/mindex)

[![NPM](https://nodei.co/npm/mindex.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/mindex)

---

Special thanks to [Arthur Andrew Medical](http://www.arthurandrew.com/) for sponsoring this project.

Arthur Andrew Medical manufactures products with ingredients that have extensive clinical research for safety and efficacy. We specialize in Enzymes, Probiotics and Antioxidants.

---

### Some Biased Benchmarks

I tried to compare using Mindex to simply searching/sorting an array of the records. This uses a database of 50,000 records for the testing.

Not surprisingly, inserts are slower. But everything else is a landslide.

```
***********************
Test Mindex performance
***********************

Testing insertRecord(record)

Mindex 16.80 ops/sec, Native Array 45.51 ops/sec
Mindex is 63% slower


Testing get(key)

Mindex 3485998.20 ops/sec, Native Array 642.11 ops/sec
Mindex is 542799% faster


Testing getAll(), get all records

Mindex 374.92 ops/sec, Native Array 14.41 ops/sec
Mindex is 2502% faster


Testing removeRecord(key, value)

Mindex 1955971.50 ops/sec, Native Array 220.43 ops/sec
Mindex is 887260% faster
```

### What makes Mindex so fast?

A very simple (and old) idea, [Binary Search](https://en.wikipedia.org/wiki/Binary_search_algorithm). Mindex populates two arrays, an array of `keys` and an array of `values`. What makes Mindex useful is how it abstracts all the complexity of managing the arrays from you, and the simple querying capabilities it provides.

###### If Mindex is just arrays of keys and values, how is it compound?

After searching through an index it is possible for Mindex to find....another Mindex. This complexity is also handled for you. Mindex will create as many nested indexes as is necessary to hold your data. There is no limit on the depth of compound keys.

## Installation

Supports node v4.0+

```
npm install --save mindex
```

## TL;DR

```javascript
var Mindex = require('mindex')

var index = Mindex(['age'])

index.insertRecord({
  id: 'John',
  age: 25
})
index.insertRecord({
  id: 'Darcy',
  age: 28
})
index.insertRecord({
  id: 'Jim',
  age: 29
})
index.insertRecord({
  id: 'Betty',
  age: 25
})

// Get IDs by key
console.log(index.get(25)) // [ 'Betty', 'John' ]

// Get all IDs sorted by key (age)
console.log(index.getAll()) // [ 'Betty', 'John', 'Darcy', 'Jim' ]

// Get all IDs within a given range
console.log(index.query({'>': [22], '<': [29]})) // [ 'Betty', 'John', 'Darcy' ]

```

---

### `Constructor(keyList)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| keyList | [] | Array | The array of keys to index records by |

##### returns

`mindex instance`

##### Description

Creates a new index.

##### Example

```javascript
var Mindex = require('mindex')

var mindex = Mindex(['city', 'age'])
```

---

### `insertRecord(data)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| data | undefined | Object | The object to index. Object must have an `id` property |

##### returns

undefined

##### Description

Inserts a new object into the index. This is a convenience method for `set()`.

##### Example

```javascript
mindex.insertRecord({
  id: 25,
  name: 'John',
  city: 'Denver',
  age: 35
})
```

---

### `removeRecord(data)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| data | undefined | Object | The object to remove. Object must have an `id` property |

##### returns

undefined

##### Description

Removes an object from the index. This is a convenience method for `remove()`.

##### Example

```javascript
mindex.removeRecord({
  id: 25,
  name: 'John',
  city: 'Denver',
  age: 35
})
```

---

### `updateRecord(data)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| data | undefined | Object | The object to update. Object must have an `id` property |

##### returns

undefined

##### Description

Replaces an object in the index with new data. This is a convenience method for `remove()` and `set()`.

##### Example

```javascript
mindex.updateRecord({
  id: 25,
  name: 'John',
  city: 'Denver',
  age: 35
})
```

---

### `set(keyList, value)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| keyList | undefined | Array, String, Integer | An array of values to search for in the index. If the index is not compound a string or integer may be used. |
| value | undefined | String, Integer | The value to insert at the given key |

##### returns

undefined

##### Description

Inserts the given value at the given key.

##### Example

```javascript

var mindex = Mindex(['city', 'age'])

// insertRecord and set produce equivalent results in the example below.
mindex.insertRecord({
  id: 1,
  name: 'John',
  city: 'Denver',
  age: 35
})
mindex.set(['Denver', 35], 1)

// Get all 35 year olds in the city of Denver
mindex.get(['Denver', 35]) // returns [1]
```

---

### `get(keyList)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| keyList | undefined | Array, String, Integer | An array of values to search for in the index. If the index is not compound a string or integer may be used. |

##### returns

An array of found record IDs.

##### Description

Retrieves an array of matching IDs from the index.

##### Example

```javascript

mindex.insertRecord({
  id: 1,
  name: 'John',
  city: 'Denver',
  age: 35
})

mindex.insertRecord({
  id: 2,
  name: 'Betty',
  city: 'Denver',
  age: 37
})

// Get all 35 year olds in the city of Denver
mindex.get(['Denver', 35]) // returns [1]

// If you are only looking for 'Denver' you can omit the array.
mindex.get('Denver') // returns [1, 2]
```

---

### `remove(keyList, value)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| keyList | undefined | Array, String, Integer | An array of values to search for in the index. If the index is not compound a string or integer may be used. |
| value | undefined | String, Integer | The value to remove at the given key |

##### returns

undefined

##### Description

Removes the given value from the index at the given key.

##### Example

```javascript

var mindex = Mindex(['city', 'age'])

mindex.insertRecord({
  id: 1,
  name: 'John',
  city: 'Denver',
  age: 35
})

mindex.get(['Denver', 35]) // returns [1]

// removeRecord and remove produce equivalent results in the example below.
mindex.removeRecord({
  id: 1,
  name: 'John',
  city: 'Denver',
  age: 35
})
// -- or --
mindex.remove(['Denver', 35], 1)

// Get all 35 year olds in the city of Denver
mindex.get(['Denver', 35]) // returns []
```

---

### `getAll()`

##### returns

An array of all IDs in the index, sorted by key(s).

##### Description

Retrieves an array of all IDs.

##### Example

```javascript

mindex.insertRecord({
  id: 1,
  name: 'John',
  city: 'Denver',
  age: 35
})

mindex.insertRecord({
  id: 2,
  name: 'Betty',
  city: 'Denver',
  age: 37
})

mindex.getAll() // returns [1, 2]
```

---

### `query(query)`

##### Parameters

| key | default | type | description |
| --- | --- | --- | --- |
| query | undefined | Object | An object representing the query. |

##### Query Options

| key | default | type | description |
| --- | --- | --- | --- |
| `>` | undefined | Array | An array of keys to search for. Mutually exclusive with `>=` |
| `>=` | undefined | Array | An array of keys to search for. Mutually exclusive with `>` |
| `<` | undefined | Array | An array of keys to search for. Mutually exclusive with `<=` |
| `<=` | undefined | Array | An array of keys to search for. Mutually exclusive with `<` |
| `offset` | 0 | Integer | Number of IDs to skip, can be used for pagination. |
| `limit` | undefined | Integer | Maximum number of IDs to return |

##### returns

An array of found record IDs.

##### Description

Retrieves an array of matching IDs from the index.

##### Example

```javascript

var mindex = Mindex(['city', 'age'])

mindex.insertRecord({
  id: 1,
  name: 'John',
  city: 'Denver',
  age: 35
})

mindex.insertRecord({
  id: 2,
  name: 'Betty',
  city: 'Denver',
  age: 37
})

mindex.insertRecord({
  id: 3,
  name: 'Jen',
  city: 'Phoenix',
  age: 36
})

mindex.insertRecord({
  id: 4,
  name: 'Jim',
  city: 'Denver',
  age: 37
})

index.query({'>': ['Denver', 35], '<=': ['Denver', 37]}) // returns [2,4]

index.query({'>=': ['Denver', 35], '<=': ['Denver', 37], offset: 1}) // returns [2,4]

index.query({'>=': ['Denver', 35], '<=': ['Denver', 37], limit: 1}) // returns [1,2]

index.query({'>': ['Denver'], '<=': ['Phoenix']}) // returns [3]

index.query({'>=': ['Denver'], '<=': ['Phoenix']}) // returns [1,2,4,3]

index.query({'>=': ['Denver'], '<': ['Phoenix']}) // returns [1,2,4]

index.query({'>=': ['Denver']}) // returns [1,2,4,3]
```

---

### `clear()`

##### returns

undefined

##### Description

Clears the index.

##### Example

```javascript

mindex.insertRecord({
  id: 1,
  name: 'John',
  city: 'Denver',
  age: 35
})

mindex.insertRecord({
  id: 2,
  name: 'Betty',
  city: 'Denver',
  age: 37
})

mindex.clear()

mindex.getAll() // returns []
```
