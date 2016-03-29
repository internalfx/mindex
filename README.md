
# Mindex

A small simple javascript compound index that borrows heavily from LokiJS.

### Features

- **Small** - Under 300 lines of code.
- **Fast** - Records can be found in O(log n) time.
- **Powerful** - Supports compound keys and allows for a simple query syntax.

[![npm version](https://img.shields.io/npm/v/mindex.svg)](https://www.npmjs.com/package/mindex) [![license](https://img.shields.io/npm/l/mindex.svg)](https://github.com/internalfx/mindex/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/mindex.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/mindex)

---

Special thanks to [Arthur Andrew Medical](http://www.arthurandrew.com/) for sponsoring this project.

Arthur Andrew Medical manufactures products with ingredients that have extensive clinical research for safety and efficacy. We specialize in Enzymes, Probiotics and Antioxidants.

---

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

// Get id's by key
console.log(index.get(25)) // [ 'Betty', 'John' ]

// Get all id's sorted by key (age)
console.log(index.getAll()) // [ 'Betty', 'John', 'Darcy', 'Jim' ]

// Get all id's within a given range
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

Inserts a new object into the index.

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

Removes an object from the index.

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

Replaces an object in the index with new data.

##### Example

```javascript
mindex.updateRecord({
  id: 25,
  name: 'John',
  city: 'Denver',
  age: 35
})
```
