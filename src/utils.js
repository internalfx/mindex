'use strict'

// Some code taken with gratitiude from the LokiJS project.

var sort = function (a, b) {
  if (a === null && b === null) {
    return 0
  }

  if (a === null) {
    return -1
  }

  if (b === null) {
    return 1
  }

  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}

module.exports = {
  insertAt: function (array, index, value) {
    array.splice(index, 0, value)
    return array
  },

  removeAt: function (array, index) {
    array.splice(index, 1)
    return array
  },

  binarySearch: function (array, value) {
    let lo = 0
    let hi = array.length
    let compared
    let mid

    while (lo < hi) {
      mid = ((lo + hi) / 2) | 0
      compared = sort(value, array[mid])
      if (compared === 0) {
        return {
          found: true,
          index: mid
        }
      } else if (compared < 0) {
        hi = mid
      } else {
        lo = mid + 1
      }
    }

    return {
      found: false,
      index: hi
    }
  }
}
