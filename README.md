
# Mindex

A small simple javascript compound index.

Borrows heavily from LokiJS.

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
