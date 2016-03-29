'use strict'

var _ = require('lodash')
var faker = require('faker')
var createIndex = require('./src/mindex')
var Benchmark = require('benchmark')
var colors = require('colors')
var async = require('async')
Benchmark.support.decompilation = false

var compileResult = (results) => {
  var percentage
  var text = `Mindex ${results[0].toFixed(2)} ops/sec, Native Array ${results[1].toFixed(2)} ops/sec\n`

  if (results[0] > results[1]) {
    percentage = ((results[0] - results[1]) / results[1]) * 100
    text += colors.green(`Mindex is ${percentage.toFixed()}% faster\n`)
  } else {
    percentage = ((results[1] - results[0]) / results[1]) * 100
    text += colors.red(`Mindex is ${percentage.toFixed()}% slower\n`)
  }

  return text
}

var db = []
var dbSize = 50000

console.log('\nCreating index of ' + dbSize + ' records')
console.time('Done!')
for (let i = 0; i < dbSize; i++) {
  let rec = {
    id: faker.random.number({max: 999999999999}),
    age: faker.random.number({max: 90}),
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    title: faker.name.jobTitle()
  }
  db.push(rec)
}
console.timeEnd('Done!')

console.log('\n')
console.log('***********************')
console.log('Test Mindex performance')
console.log('***********************')

async.series([
  (done) => {
    console.log('\nTesting insertRecord(record)\n'.yellow)

    var suite = new Benchmark.Suite()
    var results = []
    var mindex
    var aindex

    suite.add({
      name: 'tree',
      setup: () => {
        mindex = createIndex(['age'])
      },
      fn: () => {
        for (let rec of db) {
          mindex.insertRecord(rec)
        }
      }
    })

    suite.add({
      name: 'array',
      setup: () => {
        aindex = []
      },
      fn: function () {
        for (let rec of db) {
          aindex.push({key: rec.age, val: rec.name})
        }
      }
    })

    suite.on('error', (event) => {
      console.log(event.target.error)
      done(event.target.error)
    })

    suite.on('complete', () => {
      suite.forEach((obj) => { results.push(obj.hz) })
      console.log(compileResult(results))
      done()
    })

    suite.run()
  },

  (done) => {
    console.log('\nTesting get(key)\n'.yellow)

    var suite = new Benchmark.Suite()
    var results = []
    var mindex = createIndex(['age'])
    var aindex = []
    var randKey

    for (let rec of db) {
      mindex.insertRecord(rec)
    }

    for (let rec of db) {
      aindex.push({key: rec.age, val: rec.name})
    }

    suite.add({
      name: 'tree',
      setup: () => {
        randKey = db[_.random(0, db.length)].age
      },
      fn: () => {
        mindex.get(randKey)
      }
    })

    suite.add({
      name: 'array',
      setup: () => {
        randKey = db[_.random(0, db.length)].age
      },
      fn: function () {
        _.filter(aindex, {key: randKey})
      }
    })

    suite.on('error', (event) => {
      console.log(event.target.error)
      done(event.target.error)
    })

    suite.on('complete', () => {
      suite.forEach((obj) => { results.push(obj.hz) })
      console.log(compileResult(results))
      done()
    })

    suite.run()
  },

  (done) => {
    console.log('\nTesting getAll(), get all records\n'.yellow)

    var suite = new Benchmark.Suite()
    var results = []
    var mindex = createIndex(['age'])
    var aindex = []

    for (let rec of db) {
      mindex.insertRecord(rec.age, rec.name)
    }

    for (let rec of db) {
      aindex.push({key: rec.age, val: rec.name})
    }

    suite.add({
      name: 'tree',
      setup: () => {
      },
      fn: () => {
        mindex.getAll()
      }
    })

    suite.add({
      name: 'array',
      setup: () => {
      },
      fn: function () {
        _.sortByOrder(aindex, ['key'], ['asc'])
      }
    })

    suite.on('error', (event) => {
      console.log(event.target.error)
      done(event.target.error)
    })

    suite.on('complete', () => {
      suite.forEach((obj) => { results.push(obj.hz) })
      console.log(compileResult(results))
      done()
    })

    suite.run()
  },

  (done) => {
    console.log('\nTesting removeRecord(key, value)\n'.yellow)

    var suite = new Benchmark.Suite()
    var results = []
    var mindex
    var aindex
    var randRec

    suite.add({
      name: 'tree',
      setup: () => {
        mindex = createIndex(['age'])
        for (let rec of db) {
          mindex.insertRecord(rec)
        }
        randRec = db[_.random(0, db.length)]
      },
      fn: () => {
        mindex.removeRecord(randRec)
      }
    })

    suite.add({
      name: 'array',
      setup: () => {
        aindex = []
        for (let rec of db) {
          aindex.push({key: rec.age, val: rec.name})
        }
        randRec = db[_.random(0, db.length - 1)]
      },
      fn: function () {
        _.remove(aindex, {key: randRec.age, val: randRec.name})
      }
    })

    suite.on('error', (event) => {
      console.log(event.target.error)
      done(event.target.error)
    })

    suite.on('complete', () => {
      suite.forEach((obj) => { results.push(obj.hz) })
      console.log(compileResult(results))
      done()
    })

    suite.run()
  }
])
