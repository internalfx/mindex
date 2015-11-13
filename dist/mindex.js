(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mindex"] = factory();
	else
		root["mindex"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(1);

	var _isArray = __webpack_require__(2);

	var _isArray2 = _interopRequireDefault(_isArray);

	var _merge = __webpack_require__(5);

	var _merge2 = _interopRequireDefault(_merge);

	var _omit = __webpack_require__(14);

	var _omit2 = _interopRequireDefault(_omit);

	var _clone = __webpack_require__(8);

	var _clone2 = _interopRequireDefault(_clone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BaseSecondaryIndex = {

	  set: function set(keyList, value) {
	    if (!(0, _isArray2.default)(keyList)) {
	      keyList = [keyList];
	    }

	    var key = keyList.shift() || null;
	    var pos = (0, _utils.binarySearch)(this.keys, key);

	    if (keyList.length === 0) {
	      if (pos.found) {
	        var dataLocation = (0, _utils.binarySearch)(this.values[pos.index], value);
	        if (!dataLocation.found) {
	          (0, _utils.insertAt)(this.values[pos.index], dataLocation.index, value);
	        }
	      } else {
	        (0, _utils.insertAt)(this.keys, pos.index, key);
	        (0, _utils.insertAt)(this.values, pos.index, [value]);
	      }
	    } else {
	      if (pos.found) {
	        this.values[pos.index].set(keyList, value);
	      } else {
	        (0, _utils.insertAt)(this.keys, pos.index, key);
	        var newIndex = createIndex();
	        newIndex.set(keyList, value);
	        (0, _utils.insertAt)(this.values, pos.index, newIndex);
	      }
	    }
	  },

	  get: function get(keyList) {
	    if (!(0, _isArray2.default)(keyList)) {
	      keyList = [keyList];
	    }

	    var key = keyList.shift() || null;
	    var pos = (0, _utils.binarySearch)(this.keys, key);

	    if (keyList.length === 0) {
	      if (pos.found) {
	        if (this.values[pos.index].isIndex) {
	          return this.values[pos.index].getAll();
	        } else {
	          return this.values[pos.index];
	        }
	      } else {
	        return [];
	      }
	    } else {
	      if (pos.found) {
	        return this.values[pos.index].get(keyList);
	      } else {
	        return [];
	      }
	    }
	  },

	  getAll: function getAll() {
	    var results = [];
	    this.values.forEach(function (value) {
	      if (value.isIndex) {
	        results = results.concat(value.getAll());
	      } else {
	        results = results.concat(value);
	      }
	    });
	    return results;
	  },

	  query: function query(_query) {
	    var leftKeys = undefined;
	    var rightKeys = undefined;

	    if (_query['>']) {
	      leftKeys = _query['>'];
	      _query.leftInclusive = false;
	    } else if (_query['>=']) {
	      leftKeys = _query['>='];
	      _query.leftInclusive = true;
	    }

	    if (_query['<']) {
	      rightKeys = _query['<'];
	      _query.rightInclusive = false;
	    } else if (_query['<=']) {
	      rightKeys = _query['<='];
	      _query.rightInclusive = true;
	    }

	    if (leftKeys.length !== rightKeys.length) {
	      throw new Error('Key arrays must be same length');
	    }

	    return this.between(leftKeys, rightKeys, (0, _omit2.default)(_query, ['>', '>=', '<', '<=']));
	  },

	  between: function between(leftKeys, rightKeys, opts) {
	    opts = (0, _merge2.default)({
	      leftInclusive: true,
	      rightInclusive: false,
	      limit: undefined,
	      offset: 0
	    }, opts);

	    var results = this._between(leftKeys, rightKeys, opts);

	    if (opts.limit) {
	      return results.slice(opts.offset, opts.limit + opts.offset);
	    } else {
	      return results.slice(opts.offset);
	    }
	  },

	  _between: function _between(leftKeys, rightKeys, opts) {
	    var results = [];

	    var leftKey = leftKeys.shift();
	    var rightKey = rightKeys.shift();

	    var pos = undefined;

	    if (leftKey !== undefined) {
	      pos = (0, _utils.binarySearch)(this.keys, leftKey);
	    } else {
	      pos = {
	        found: false,
	        index: 0
	      };
	    }

	    if (leftKeys.length === 0) {
	      if (pos.found && opts.leftInclusive === false) {
	        pos.index += 1;
	      }

	      for (var i = pos.index; i < this.keys.length; i += 1) {
	        if (rightKey !== undefined) {
	          if (opts.rightInclusive) {
	            if (this.keys[i] > rightKey) {
	              break;
	            }
	          } else {
	            if (this.keys[i] >= rightKey) {
	              break;
	            }
	          }
	        }

	        if (this.values[i].isIndex) {
	          results = results.concat(this.values[i].getAll());
	        } else {
	          results = results.concat(this.values[i]);
	        }

	        if (opts.limit) {
	          if (results.length >= opts.limit + opts.offset) {
	            break;
	          }
	        }
	      }
	    } else {
	      for (var i = pos.index; i < this.keys.length; i += 1) {
	        var currKey = this.keys[i];
	        if (currKey > rightKey) {
	          break;
	        }

	        if (this.values[i].isIndex) {
	          if (currKey === leftKey) {
	            results = results.concat(this.values[i]._between((0, _clone2.default)(leftKeys), rightKeys.map(function () {
	              return undefined;
	            }), opts));
	          } else if (currKey === rightKey) {
	            results = results.concat(this.values[i]._between(leftKeys.map(function () {
	              return undefined;
	            }), (0, _clone2.default)(rightKeys), opts));
	          } else {
	            results = results.concat(this.values[i].getAll());
	          }
	        } else {
	          results = results.concat(this.values[i]);
	        }

	        if (opts.limit) {
	          if (results.length >= opts.limit + opts.offset) {
	            break;
	          }
	        }
	      }
	    }

	    if (opts.limit) {
	      return results.slice(0, opts.limit + opts.offset);
	    } else {
	      return results;
	    }
	  },

	  remove: function remove(keyList, value) {
	    if (!(0, _isArray2.default)(keyList)) {
	      keyList = [keyList];
	    }

	    var key = keyList.shift();
	    var pos = (0, _utils.binarySearch)(this.keys, key);

	    if (keyList.length === 0) {
	      if (pos.found) {
	        var dataLocation = (0, _utils.binarySearch)(this.values[pos.index], value);
	        if (dataLocation.found) {
	          (0, _utils.removeAt)(this.values[pos.index], dataLocation.index);
	          if (this.values[pos.index].length === 0) {
	            (0, _utils.removeAt)(this.keys, pos.index);
	            (0, _utils.removeAt)(this.values, pos.index);
	          }
	        }
	      }
	    } else {
	      if (pos.found) {
	        this.values[pos.index].delete(keyList, value);
	      }
	    }
	  },

	  clear: function clear() {
	    this.keys = [];
	    this.values = [];
	  },

	  insertRecord: function insertRecord(data) {
	    var keyList = this.fieldList.map(function (field) {
	      return data[field] || null;
	    });

	    this.set(keyList, data.id);
	  },

	  removeRecord: function removeRecord(data) {
	    var keyList = this.fieldList.map(function (field) {
	      return data[field] || null;
	    });

	    this.remove(keyList, data.id);
	  },

	  updateRecord: function updateRecord(data) {
	    this.removeRecord(data);
	    this.insertRecord(data);
	  }
	};

	var createIndex = function createIndex() {
	  var fieldList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

	  var index = Object.create(BaseSecondaryIndex);

	  if (!(0, _isArray2.default)(fieldList)) {
	    throw new Error('fieldList must be an array.');
	  }

	  index.fieldList = fieldList;
	  index.isIndex = true;
	  index.keys = [];
	  index.values = [];

	  return index;
	};

	exports.default = createIndex;
	//# sourceMappingURL=data:application/json;base64,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RUFBRSxDQUFDLENBQUE7R0FDM0I7O0FBRUQsY0FBWSxFQUFFLHNCQUFVLElBQUksRUFBRTtBQUM1QixRQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssRUFBRTtBQUNoRCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUE7S0FDM0IsQ0FBQyxDQUFBOztBQUVGLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUM5Qjs7QUFFRCxjQUFZLEVBQUUsc0JBQVUsSUFBSSxFQUFFO0FBQzVCLFFBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdkIsUUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN4QjtDQUNGLENBQUE7O0FBRUQsSUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLEdBQTZCO01BQWhCLFNBQVMseURBQUcsRUFBRTs7QUFDeEMsTUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBOztBQUU3QyxNQUFJLENBQUMsdUJBQVEsU0FBUyxDQUFDLEVBQUU7QUFDdkIsVUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0dBQy9DOztBQUVELE9BQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO0FBQzNCLE9BQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLE9BQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ2YsT0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7O0FBRWpCLFNBQU8sS0FBSyxDQUFBO0NBQ2IsQ0FBQTs7a0JBRWMsV0FBVyIsImZpbGUiOiJtaW5kZXguZXM2Iiwic291cmNlUm9vdCI6Ii9ob21lL2Jtb3JyaXMvb3duQ2xvdWQvcHJvamVjdHMvbWluZGV4Iiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge2JpbmFyeVNlYXJjaCwgaW5zZXJ0QXQsIHJlbW92ZUF0fSBmcm9tICcuL3V0aWxzJ1xuaW1wb3J0IGlzQXJyYXkgZnJvbSAnbW91dC9sYW5nL2lzQXJyYXknXG5pbXBvcnQgbWVyZ2UgZnJvbSAnbW91dC9vYmplY3QvbWVyZ2UnXG5pbXBvcnQgb21pdCBmcm9tICdtb3V0L29iamVjdC9vbWl0J1xuaW1wb3J0IGNsb25lIGZyb20gJ21vdXQvbGFuZy9jbG9uZSdcblxudmFyIEJhc2VTZWNvbmRhcnlJbmRleCA9IHtcblxuICBzZXQ6IGZ1bmN0aW9uIChrZXlMaXN0LCB2YWx1ZSkge1xuICAgIGlmICghaXNBcnJheShrZXlMaXN0KSkge1xuICAgICAga2V5TGlzdCA9IFtrZXlMaXN0XVxuICAgIH1cblxuICAgIGxldCBrZXkgPSBrZXlMaXN0LnNoaWZ0KCkgfHwgbnVsbFxuICAgIGxldCBwb3MgPSBiaW5hcnlTZWFyY2godGhpcy5rZXlzLCBrZXkpXG5cbiAgICBpZiAoa2V5TGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChwb3MuZm91bmQpIHtcbiAgICAgICAgbGV0IGRhdGFMb2NhdGlvbiA9IGJpbmFyeVNlYXJjaCh0aGlzLnZhbHVlc1twb3MuaW5kZXhdLCB2YWx1ZSlcbiAgICAgICAgaWYgKCFkYXRhTG9jYXRpb24uZm91bmQpIHtcbiAgICAgICAgICBpbnNlcnRBdCh0aGlzLnZhbHVlc1twb3MuaW5kZXhdLCBkYXRhTG9jYXRpb24uaW5kZXgsIHZhbHVlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnNlcnRBdCh0aGlzLmtleXMsIHBvcy5pbmRleCwga2V5KVxuICAgICAgICBpbnNlcnRBdCh0aGlzLnZhbHVlcywgcG9zLmluZGV4LCBbdmFsdWVdKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocG9zLmZvdW5kKSB7XG4gICAgICAgIHRoaXMudmFsdWVzW3Bvcy5pbmRleF0uc2V0KGtleUxpc3QsIHZhbHVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zZXJ0QXQodGhpcy5rZXlzLCBwb3MuaW5kZXgsIGtleSlcbiAgICAgICAgbGV0IG5ld0luZGV4ID0gY3JlYXRlSW5kZXgoKVxuICAgICAgICBuZXdJbmRleC5zZXQoa2V5TGlzdCwgdmFsdWUpXG4gICAgICAgIGluc2VydEF0KHRoaXMudmFsdWVzLCBwb3MuaW5kZXgsIG5ld0luZGV4KVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uIChrZXlMaXN0KSB7XG4gICAgaWYgKCFpc0FycmF5KGtleUxpc3QpKSB7XG4gICAgICBrZXlMaXN0ID0gW2tleUxpc3RdXG4gICAgfVxuXG4gICAgbGV0IGtleSA9IGtleUxpc3Quc2hpZnQoKSB8fCBudWxsXG4gICAgbGV0IHBvcyA9IGJpbmFyeVNlYXJjaCh0aGlzLmtleXMsIGtleSlcblxuICAgIGlmIChrZXlMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHBvcy5mb3VuZCkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZXNbcG9zLmluZGV4XS5pc0luZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW3Bvcy5pbmRleF0uZ2V0QWxsKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbcG9zLmluZGV4XVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW11cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBvcy5mb3VuZCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbcG9zLmluZGV4XS5nZXQoa2V5TGlzdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBnZXRBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcmVzdWx0cyA9IFtdXG4gICAgdGhpcy52YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh2YWx1ZS5pc0luZGV4KSB7XG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdCh2YWx1ZS5nZXRBbGwoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdCh2YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiByZXN1bHRzXG4gIH0sXG5cbiAgcXVlcnk6IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgIGxldCBsZWZ0S2V5c1xuICAgIGxldCByaWdodEtleXNcblxuICAgIGlmIChxdWVyeVsnPiddKSB7XG4gICAgICBsZWZ0S2V5cyA9IHF1ZXJ5Wyc+J11cbiAgICAgIHF1ZXJ5LmxlZnRJbmNsdXNpdmUgPSBmYWxzZVxuICAgIH0gZWxzZSBpZiAocXVlcnlbJz49J10pIHtcbiAgICAgIGxlZnRLZXlzID0gcXVlcnlbJz49J11cbiAgICAgIHF1ZXJ5LmxlZnRJbmNsdXNpdmUgPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHF1ZXJ5Wyc8J10pIHtcbiAgICAgIHJpZ2h0S2V5cyA9IHF1ZXJ5Wyc8J11cbiAgICAgIHF1ZXJ5LnJpZ2h0SW5jbHVzaXZlID0gZmFsc2VcbiAgICB9IGVsc2UgaWYgKHF1ZXJ5Wyc8PSddKSB7XG4gICAgICByaWdodEtleXMgPSBxdWVyeVsnPD0nXVxuICAgICAgcXVlcnkucmlnaHRJbmNsdXNpdmUgPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKGxlZnRLZXlzLmxlbmd0aCAhPT0gcmlnaHRLZXlzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgYXJyYXlzIG11c3QgYmUgc2FtZSBsZW5ndGgnKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmJldHdlZW4obGVmdEtleXMsIHJpZ2h0S2V5cywgb21pdChxdWVyeSwgWyc+JywgJz49JywgJzwnLCAnPD0nXSkpXG4gIH0sXG5cbiAgYmV0d2VlbjogZnVuY3Rpb24gKGxlZnRLZXlzLCByaWdodEtleXMsIG9wdHMpIHtcbiAgICBvcHRzID0gbWVyZ2Uoe1xuICAgICAgbGVmdEluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgIHJpZ2h0SW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgIGxpbWl0OiB1bmRlZmluZWQsXG4gICAgICBvZmZzZXQ6IDBcbiAgICB9LCBvcHRzKVxuXG4gICAgbGV0IHJlc3VsdHMgPSB0aGlzLl9iZXR3ZWVuKGxlZnRLZXlzLCByaWdodEtleXMsIG9wdHMpXG5cbiAgICBpZiAob3B0cy5saW1pdCkge1xuICAgICAgcmV0dXJuIHJlc3VsdHMuc2xpY2Uob3B0cy5vZmZzZXQsIG9wdHMubGltaXQgKyBvcHRzLm9mZnNldClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdHMuc2xpY2Uob3B0cy5vZmZzZXQpXG4gICAgfVxuICB9LFxuXG4gIF9iZXR3ZWVuOiBmdW5jdGlvbiAobGVmdEtleXMsIHJpZ2h0S2V5cywgb3B0cykge1xuICAgIGxldCByZXN1bHRzID0gW11cblxuICAgIGxldCBsZWZ0S2V5ID0gbGVmdEtleXMuc2hpZnQoKVxuICAgIGxldCByaWdodEtleSA9IHJpZ2h0S2V5cy5zaGlmdCgpXG5cbiAgICBsZXQgcG9zXG5cbiAgICBpZiAobGVmdEtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwb3MgPSBiaW5hcnlTZWFyY2godGhpcy5rZXlzLCBsZWZ0S2V5KVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3MgPSB7XG4gICAgICAgIGZvdW5kOiBmYWxzZSxcbiAgICAgICAgaW5kZXg6IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobGVmdEtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAocG9zLmZvdW5kICYmIG9wdHMubGVmdEluY2x1c2l2ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcG9zLmluZGV4ICs9IDFcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IHBvcy5pbmRleDsgaSA8IHRoaXMua2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAocmlnaHRLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRzLnJpZ2h0SW5jbHVzaXZlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5rZXlzW2ldID4gcmlnaHRLZXkpIHsgYnJlYWsgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5rZXlzW2ldID49IHJpZ2h0S2V5KSB7IGJyZWFrIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52YWx1ZXNbaV0uaXNJbmRleCkge1xuICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdCh0aGlzLnZhbHVlc1tpXS5nZXRBbGwoKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQodGhpcy52YWx1ZXNbaV0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0cy5saW1pdCkge1xuICAgICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA+PSAob3B0cy5saW1pdCArIG9wdHMub2Zmc2V0KSkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IHBvcy5pbmRleDsgaSA8IHRoaXMua2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBsZXQgY3VycktleSA9IHRoaXMua2V5c1tpXVxuICAgICAgICBpZiAoY3VycktleSA+IHJpZ2h0S2V5KSB7IGJyZWFrIH1cblxuICAgICAgICBpZiAodGhpcy52YWx1ZXNbaV0uaXNJbmRleCkge1xuICAgICAgICAgIGlmIChjdXJyS2V5ID09PSBsZWZ0S2V5KSB7XG4gICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQodGhpcy52YWx1ZXNbaV0uX2JldHdlZW4oY2xvbmUobGVmdEtleXMpLCByaWdodEtleXMubWFwKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZCB9KSwgb3B0cykpXG4gICAgICAgICAgfSBlbHNlIGlmIChjdXJyS2V5ID09PSByaWdodEtleSkge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0KHRoaXMudmFsdWVzW2ldLl9iZXR3ZWVuKGxlZnRLZXlzLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQgfSksIGNsb25lKHJpZ2h0S2V5cyksIG9wdHMpKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQodGhpcy52YWx1ZXNbaV0uZ2V0QWxsKCkpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdCh0aGlzLnZhbHVlc1tpXSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzLmxpbWl0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID49IChvcHRzLmxpbWl0ICsgb3B0cy5vZmZzZXQpKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRzLmxpbWl0KSB7XG4gICAgICByZXR1cm4gcmVzdWx0cy5zbGljZSgwLCBvcHRzLmxpbWl0ICsgb3B0cy5vZmZzZXQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuICB9LFxuXG4gIHJlbW92ZTogZnVuY3Rpb24gKGtleUxpc3QsIHZhbHVlKSB7XG4gICAgaWYgKCFpc0FycmF5KGtleUxpc3QpKSB7XG4gICAgICBrZXlMaXN0ID0gW2tleUxpc3RdXG4gICAgfVxuXG4gICAgbGV0IGtleSA9IGtleUxpc3Quc2hpZnQoKVxuICAgIGxldCBwb3MgPSBiaW5hcnlTZWFyY2godGhpcy5rZXlzLCBrZXkpXG5cbiAgICBpZiAoa2V5TGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChwb3MuZm91bmQpIHtcbiAgICAgICAgbGV0IGRhdGFMb2NhdGlvbiA9IGJpbmFyeVNlYXJjaCh0aGlzLnZhbHVlc1twb3MuaW5kZXhdLCB2YWx1ZSlcbiAgICAgICAgaWYgKGRhdGFMb2NhdGlvbi5mb3VuZCkge1xuICAgICAgICAgIHJlbW92ZUF0KHRoaXMudmFsdWVzW3Bvcy5pbmRleF0sIGRhdGFMb2NhdGlvbi5pbmRleClcbiAgICAgICAgICBpZiAodGhpcy52YWx1ZXNbcG9zLmluZGV4XS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJlbW92ZUF0KHRoaXMua2V5cywgcG9zLmluZGV4KVxuICAgICAgICAgICAgcmVtb3ZlQXQodGhpcy52YWx1ZXMsIHBvcy5pbmRleClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBvcy5mb3VuZCkge1xuICAgICAgICB0aGlzLnZhbHVlc1twb3MuaW5kZXhdLmRlbGV0ZShrZXlMaXN0LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmtleXMgPSBbXVxuICAgIHRoaXMudmFsdWVzID0gW11cbiAgfSxcblxuICBpbnNlcnRSZWNvcmQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgbGV0IGtleUxpc3QgPSB0aGlzLmZpZWxkTGlzdC5tYXAoZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgICByZXR1cm4gZGF0YVtmaWVsZF0gfHwgbnVsbFxuICAgIH0pXG5cbiAgICB0aGlzLnNldChrZXlMaXN0LCBkYXRhLmlkKVxuICB9LFxuXG4gIHJlbW92ZVJlY29yZDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBsZXQga2V5TGlzdCA9IHRoaXMuZmllbGRMaXN0Lm1hcChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICAgIHJldHVybiBkYXRhW2ZpZWxkXSB8fCBudWxsXG4gICAgfSlcblxuICAgIHRoaXMucmVtb3ZlKGtleUxpc3QsIGRhdGEuaWQpXG4gIH0sXG5cbiAgdXBkYXRlUmVjb3JkOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMucmVtb3ZlUmVjb3JkKGRhdGEpXG4gICAgdGhpcy5pbnNlcnRSZWNvcmQoZGF0YSlcbiAgfVxufVxuXG52YXIgY3JlYXRlSW5kZXggPSBmdW5jdGlvbiAoZmllbGRMaXN0ID0gW10pIHtcbiAgdmFyIGluZGV4ID0gT2JqZWN0LmNyZWF0ZShCYXNlU2Vjb25kYXJ5SW5kZXgpXG5cbiAgaWYgKCFpc0FycmF5KGZpZWxkTGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpZWxkTGlzdCBtdXN0IGJlIGFuIGFycmF5LicpXG4gIH1cblxuICBpbmRleC5maWVsZExpc3QgPSBmaWVsZExpc3RcbiAgaW5kZXguaXNJbmRleCA9IHRydWVcbiAgaW5kZXgua2V5cyA9IFtdXG4gIGluZGV4LnZhbHVlcyA9IFtdXG5cbiAgcmV0dXJuIGluZGV4XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUluZGV4XG4iXX0=

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	// Some code taken with gratitiude from the LokiJS project.

	var sort = exports.sort = function sort(a, b) {
	  if (a === null && b === null) {
	    return 0;
	  }

	  if (a === null) {
	    return -1;
	  }

	  if (b === null) {
	    return 1;
	  }

	  if (a < b) {
	    return -1;
	  }

	  if (a > b) {
	    return 1;
	  }

	  return 0;
	};

	var insertAt = exports.insertAt = function insertAt(array, index, value) {
	  array.splice(index, 0, value);
	  return array;
	};

	var removeAt = exports.removeAt = function removeAt(array, index) {
	  array.splice(index, 1);
	  return array;
	};

	var binarySearch = exports.binarySearch = function binarySearch(array, value) {
	  var lo = 0;
	  var hi = array.length;
	  var compared = undefined;
	  var mid = undefined;

	  while (lo < hi) {
	    mid = (lo + hi) / 2 | 0;
	    compared = sort(value, array[mid]);
	    if (compared === 0) {
	      return {
	        found: true,
	        index: mid
	      };
	    } else if (compared < 0) {
	      hi = mid;
	    } else {
	      lo = mid + 1;
	    }
	  }

	  return {
	    found: false,
	    index: hi
	  };
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHTyxJQUFJLElBQUksV0FBSixJQUFJLEdBQUcsU0FBUCxJQUFJLENBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxNQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUM1QixXQUFPLENBQUMsQ0FBQTtHQUNUOztBQUVELE1BQUksQ0FBQyxLQUFLLElBQUksRUFBRTtBQUNkLFdBQU8sQ0FBQyxDQUFDLENBQUE7R0FDVjs7QUFFRCxNQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDZCxXQUFPLENBQUMsQ0FBQTtHQUNUOztBQUVELE1BQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNULFdBQU8sQ0FBQyxDQUFDLENBQUE7R0FDVjs7QUFFRCxNQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDVCxXQUFPLENBQUMsQ0FBQTtHQUNUOztBQUVELFNBQU8sQ0FBQyxDQUFBO0NBQ1QsQ0FBQTs7QUFFTSxJQUFJLFFBQVEsV0FBUixRQUFRLEdBQUcsU0FBWCxRQUFRLENBQWEsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDbkQsT0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzdCLFNBQU8sS0FBSyxDQUFBO0NBQ2IsQ0FBQTs7QUFFTSxJQUFJLFFBQVEsV0FBUixRQUFRLEdBQUcsU0FBWCxRQUFRLENBQWEsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM1QyxPQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN0QixTQUFPLEtBQUssQ0FBQTtDQUNiLENBQUE7O0FBRU0sSUFBSSxZQUFZLFdBQVosWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFhLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDaEQsTUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ1YsTUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQTtBQUNyQixNQUFJLFFBQVEsWUFBQSxDQUFBO0FBQ1osTUFBSSxHQUFHLFlBQUEsQ0FBQTs7QUFFUCxTQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDZCxPQUFHLEdBQUcsQUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUEsR0FBSSxDQUFDLEdBQUksQ0FBQyxDQUFBO0FBQ3pCLFlBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ2xDLFFBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtBQUNsQixhQUFPO0FBQ0wsYUFBSyxFQUFFLElBQUk7QUFDWCxhQUFLLEVBQUUsR0FBRztPQUNYLENBQUE7S0FDRixNQUFNLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtBQUN2QixRQUFFLEdBQUcsR0FBRyxDQUFBO0tBQ1QsTUFBTTtBQUNMLFFBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0tBQ2I7R0FDRjs7QUFFRCxTQUFPO0FBQ0wsU0FBSyxFQUFFLEtBQUs7QUFDWixTQUFLLEVBQUUsRUFBRTtHQUNWLENBQUE7Q0FDRixDQUFBIiwiZmlsZSI6InV0aWxzLmVzNiIsInNvdXJjZVJvb3QiOiIvaG9tZS9ibW9ycmlzL293bkNsb3VkL3Byb2plY3RzL21pbmRleCIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8gU29tZSBjb2RlIHRha2VuIHdpdGggZ3JhdGl0aXVkZSBmcm9tIHRoZSBMb2tpSlMgcHJvamVjdC5cblxuZXhwb3J0IHZhciBzb3J0ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgaWYgKGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCkge1xuICAgIHJldHVybiAwXG4gIH1cblxuICBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMVxuICB9XG5cbiAgaWYgKGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xXG4gIH1cblxuICBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgcmV0dXJuIDBcbn1cblxuZXhwb3J0IHZhciBpbnNlcnRBdCA9IGZ1bmN0aW9uIChhcnJheSwgaW5kZXgsIHZhbHVlKSB7XG4gIGFycmF5LnNwbGljZShpbmRleCwgMCwgdmFsdWUpXG4gIHJldHVybiBhcnJheVxufVxuXG5leHBvcnQgdmFyIHJlbW92ZUF0ID0gZnVuY3Rpb24gKGFycmF5LCBpbmRleCkge1xuICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpXG4gIHJldHVybiBhcnJheVxufVxuXG5leHBvcnQgdmFyIGJpbmFyeVNlYXJjaCA9IGZ1bmN0aW9uIChhcnJheSwgdmFsdWUpIHtcbiAgbGV0IGxvID0gMFxuICBsZXQgaGkgPSBhcnJheS5sZW5ndGhcbiAgbGV0IGNvbXBhcmVkXG4gIGxldCBtaWRcblxuICB3aGlsZSAobG8gPCBoaSkge1xuICAgIG1pZCA9ICgobG8gKyBoaSkgLyAyKSB8IDBcbiAgICBjb21wYXJlZCA9IHNvcnQodmFsdWUsIGFycmF5W21pZF0pXG4gICAgaWYgKGNvbXBhcmVkID09PSAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmb3VuZDogdHJ1ZSxcbiAgICAgICAgaW5kZXg6IG1pZFxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tcGFyZWQgPCAwKSB7XG4gICAgICBoaSA9IG1pZFxuICAgIH0gZWxzZSB7XG4gICAgICBsbyA9IG1pZCArIDFcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvdW5kOiBmYWxzZSxcbiAgICBpbmRleDogaGlcbiAgfVxufVxuIl19

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var isKind = __webpack_require__(3);
	    /**
	     */
	    var isArray = Array.isArray || function (val) {
	        return isKind(val, 'Array');
	    };
	    module.exports = isArray;



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var kindOf = __webpack_require__(4);
	    /**
	     * Check if value is from a specific "kind".
	     */
	    function isKind(val, kind){
	        return kindOf(val) === kind;
	    }
	    module.exports = isKind;



/***/ },
/* 4 */
/***/ function(module, exports) {

	

	    var _rKind = /^\[object (.*)\]$/,
	        _toString = Object.prototype.toString,
	        UNDEF;

	    /**
	     * Gets the "kind" of value. (e.g. "String", "Number", etc)
	     */
	    function kindOf(val) {
	        if (val === null) {
	            return 'Null';
	        } else if (val === UNDEF) {
	            return 'Undefined';
	        } else {
	            return _rKind.exec( _toString.call(val) )[1];
	        }
	    }
	    module.exports = kindOf;



/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var hasOwn = __webpack_require__(6);
	var deepClone = __webpack_require__(7);
	var isObject = __webpack_require__(13);

	    /**
	     * Deep merge objects.
	     */
	    function merge() {
	        var i = 1,
	            key, val, obj, target;

	        // make sure we don't modify source element and it's properties
	        // objects are passed by reference
	        target = deepClone( arguments[0] );

	        while (obj = arguments[i++]) {
	            for (key in obj) {
	                if ( ! hasOwn(obj, key) ) {
	                    continue;
	                }

	                val = obj[key];

	                if ( isObject(val) && isObject(target[key]) ){
	                    // inception, deep merge objects
	                    target[key] = merge(target[key], val);
	                } else {
	                    // make sure arrays, regexp, date, objects are cloned
	                    target[key] = deepClone(val);
	                }

	            }
	        }

	        return target;
	    }

	    module.exports = merge;




/***/ },
/* 6 */
/***/ function(module, exports) {

	

	    /**
	     * Safer Object.hasOwnProperty
	     */
	     function hasOwn(obj, prop){
	         return Object.prototype.hasOwnProperty.call(obj, prop);
	     }

	     module.exports = hasOwn;




/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var clone = __webpack_require__(8);
	var forOwn = __webpack_require__(11);
	var kindOf = __webpack_require__(4);
	var isPlainObject = __webpack_require__(9);

	    /**
	     * Recursively clone native types.
	     */
	    function deepClone(val, instanceClone) {
	        switch ( kindOf(val) ) {
	            case 'Object':
	                return cloneObject(val, instanceClone);
	            case 'Array':
	                return cloneArray(val, instanceClone);
	            default:
	                return clone(val);
	        }
	    }

	    function cloneObject(source, instanceClone) {
	        if (isPlainObject(source)) {
	            var out = {};
	            forOwn(source, function(val, key) {
	                this[key] = deepClone(val, instanceClone);
	            }, out);
	            return out;
	        } else if (instanceClone) {
	            return instanceClone(source);
	        } else {
	            return source;
	        }
	    }

	    function cloneArray(arr, instanceClone) {
	        var out = [],
	            i = -1,
	            n = arr.length,
	            val;
	        while (++i < n) {
	            out[i] = deepClone(arr[i], instanceClone);
	        }
	        return out;
	    }

	    module.exports = deepClone;





/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var kindOf = __webpack_require__(4);
	var isPlainObject = __webpack_require__(9);
	var mixIn = __webpack_require__(10);

	    /**
	     * Clone native types.
	     */
	    function clone(val){
	        switch (kindOf(val)) {
	            case 'Object':
	                return cloneObject(val);
	            case 'Array':
	                return cloneArray(val);
	            case 'RegExp':
	                return cloneRegExp(val);
	            case 'Date':
	                return cloneDate(val);
	            default:
	                return val;
	        }
	    }

	    function cloneObject(source) {
	        if (isPlainObject(source)) {
	            return mixIn({}, source);
	        } else {
	            return source;
	        }
	    }

	    function cloneRegExp(r) {
	        var flags = '';
	        flags += r.multiline ? 'm' : '';
	        flags += r.global ? 'g' : '';
	        flags += r.ignoreCase ? 'i' : '';
	        return new RegExp(r.source, flags);
	    }

	    function cloneDate(date) {
	        return new Date(+date);
	    }

	    function cloneArray(arr) {
	        return arr.slice();
	    }

	    module.exports = clone;




/***/ },
/* 9 */
/***/ function(module, exports) {

	

	    /**
	     * Checks if the value is created by the `Object` constructor.
	     */
	    function isPlainObject(value) {
	        return (!!value && typeof value === 'object' &&
	            value.constructor === Object);
	    }

	    module.exports = isPlainObject;




/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var forOwn = __webpack_require__(11);

	    /**
	    * Combine properties from all the objects into first one.
	    * - This method affects target object in place, if you want to create a new Object pass an empty object as first param.
	    * @param {object} target    Target Object
	    * @param {...object} objects    Objects to be combined (0...n objects).
	    * @return {object} Target Object.
	    */
	    function mixIn(target, objects){
	        var i = 0,
	            n = arguments.length,
	            obj;
	        while(++i < n){
	            obj = arguments[i];
	            if (obj != null) {
	                forOwn(obj, copyProp, target);
	            }
	        }
	        return target;
	    }

	    function copyProp(val, key){
	        this[key] = val;
	    }

	    module.exports = mixIn;



/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var hasOwn = __webpack_require__(6);
	var forIn = __webpack_require__(12);

	    /**
	     * Similar to Array/forEach but works over object properties and fixes Don't
	     * Enum bug on IE.
	     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
	     */
	    function forOwn(obj, fn, thisObj){
	        forIn(obj, function(val, key){
	            if (hasOwn(obj, key)) {
	                return fn.call(thisObj, obj[key], key, obj);
	            }
	        });
	    }

	    module.exports = forOwn;




/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var hasOwn = __webpack_require__(6);

	    var _hasDontEnumBug,
	        _dontEnums;

	    function checkDontEnum(){
	        _dontEnums = [
	                'toString',
	                'toLocaleString',
	                'valueOf',
	                'hasOwnProperty',
	                'isPrototypeOf',
	                'propertyIsEnumerable',
	                'constructor'
	            ];

	        _hasDontEnumBug = true;

	        for (var key in {'toString': null}) {
	            _hasDontEnumBug = false;
	        }
	    }

	    /**
	     * Similar to Array/forEach but works over object properties and fixes Don't
	     * Enum bug on IE.
	     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
	     */
	    function forIn(obj, fn, thisObj){
	        var key, i = 0;
	        // no need to check if argument is a real object that way we can use
	        // it for arrays, functions, date, etc.

	        //post-pone check till needed
	        if (_hasDontEnumBug == null) checkDontEnum();

	        for (key in obj) {
	            if (exec(fn, obj, key, thisObj) === false) {
	                break;
	            }
	        }


	        if (_hasDontEnumBug) {
	            var ctor = obj.constructor,
	                isProto = !!ctor && obj === ctor.prototype;

	            while (key = _dontEnums[i++]) {
	                // For constructor, if it is a prototype object the constructor
	                // is always non-enumerable unless defined otherwise (and
	                // enumerated above).  For non-prototype objects, it will have
	                // to be defined on this object, since it cannot be defined on
	                // any prototype objects.
	                //
	                // For other [[DontEnum]] properties, check if the value is
	                // different than Object prototype value.
	                if (
	                    (key !== 'constructor' ||
	                        (!isProto && hasOwn(obj, key))) &&
	                    obj[key] !== Object.prototype[key]
	                ) {
	                    if (exec(fn, obj, key, thisObj) === false) {
	                        break;
	                    }
	                }
	            }
	        }
	    }

	    function exec(fn, obj, key, thisObj){
	        return fn.call(thisObj, obj[key], key, obj);
	    }

	    module.exports = forIn;




/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isKind = __webpack_require__(3);
	    /**
	     */
	    function isObject(val) {
	        return isKind(val, 'Object');
	    }
	    module.exports = isObject;



/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var slice = __webpack_require__(15);
	var contains = __webpack_require__(16);

	    /**
	     * Return a copy of the object, filtered to only contain properties except the blacklisted keys.
	     */
	    function omit(obj, var_keys){
	        var keys = typeof arguments[1] !== 'string'? arguments[1] : slice(arguments, 1),
	            out = {};

	        for (var property in obj) {
	            if (obj.hasOwnProperty(property) && !contains(keys, property)) {
	                out[property] = obj[property];
	            }
	        }
	        return out;
	    }

	    module.exports = omit;




/***/ },
/* 15 */
/***/ function(module, exports) {

	

	    /**
	     * Create slice of source array or array-like object
	     */
	    function slice(arr, start, end){
	        var len = arr.length;

	        if (start == null) {
	            start = 0;
	        } else if (start < 0) {
	            start = Math.max(len + start, 0);
	        } else {
	            start = Math.min(start, len);
	        }

	        if (end == null) {
	            end = len;
	        } else if (end < 0) {
	            end = Math.max(len + end, 0);
	        } else {
	            end = Math.min(end, len);
	        }

	        var result = [];
	        while (start < end) {
	            result.push(arr[start++]);
	        }

	        return result;
	    }

	    module.exports = slice;




/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(17);

	    /**
	     * If array contains values.
	     */
	    function contains(arr, val) {
	        return indexOf(arr, val) !== -1;
	    }
	    module.exports = contains;



/***/ },
/* 17 */
/***/ function(module, exports) {

	

	    /**
	     * Array.indexOf
	     */
	    function indexOf(arr, item, fromIndex) {
	        fromIndex = fromIndex || 0;
	        if (arr == null) {
	            return -1;
	        }

	        var len = arr.length,
	            i = fromIndex < 0 ? len + fromIndex : fromIndex;
	        while (i < len) {
	            // we iterate over sparse items since there is no way to make it
	            // work properly on IE 7-8. see #64
	            if (arr[i] === item) {
	                return i;
	            }

	            i++;
	        }

	        return -1;
	    }

	    module.exports = indexOf;



/***/ }
/******/ ])
});
;