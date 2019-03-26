module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "02f4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var defined = __webpack_require__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "097d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var speciesConstructor = __webpack_require__("ebd6");
var promiseResolve = __webpack_require__("bcaa");

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1991":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var invoke = __webpack_require__("31f4");
var html = __webpack_require__("fab2");
var cel = __webpack_require__("230e");
var global = __webpack_require__("7726");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("2d95")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "20d6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("b0c5");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");
var regexpExec = __webpack_require__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "2350":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "27c9":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, ".v-city-selector{width:386px}.v-city-selector-popper-hide{display:none}.v-city-selector-wrapper{width:360px;font-size:12px;line-height:1.5}.v-city-selector-wrapper ul{padding:0;margin:0}.v-city-selector-wrapper h5{margin-bottom:5px;padding-left:2px;font-weight:400;line-height:1.5;color:#aaa}.v-city-selector-tags{overflow:hidden;margin:5px 0;padding:0}.v-city-selector-tags li{display:block;float:left;-webkit-box-sizing:border-box;box-sizing:border-box;border-left:1px solid #fff;width:60px;line-height:20px;text-align:center;background-color:#f2f2f3;cursor:pointer}.v-city-selector-tags li:first-child{border-left:none}.v-city-selector-tags li:hover{color:#04a6e9}.v-city-selector-tags li.z-on{color:#fff;background-color:#04a6e9}.v-city-selector-list{overflow:hidden}.v-city-selector-list>div{overflow:hidden;margin:1px 0 -1px;border-bottom:1px dashed #e5e5e5;padding:5px 0;line-height:24px}.v-city-selector-list>div h6{float:left;padding-left:5px;margin:0;width:30px;font-size:13px;font-weight:400;color:#ff4949}.v-city-selector-list>div ul{overflow:hidden}.v-city-selector-list>div ul li{float:left;overflow:hidden;padding-left:4px;width:60px;white-space:nowrap;text-overflow:ellipsis;cursor:pointer}.v-city-selector-list>div ul li:hover{color:#04a6e9;background-color:#f2f2f3}", ""]);

// exports


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "28a5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__("aae3");
var anObject = __webpack_require__("cb7c");
var speciesConstructor = __webpack_require__("ebd6");
var advanceStringIndex = __webpack_require__("0390");
var toLength = __webpack_require__("9def");
var callRegExpExec = __webpack_require__("5f1b");
var regexpExec = __webpack_require__("520a");
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';

// eslint-disable-next-line no-empty
var SUPPORTS_Y = !!(function () { try { return new RegExp('x', 'y'); } catch (e) {} })();

// @@split logic
__webpack_require__("214f")('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? 0xffffffff : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "31f4":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4a59":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var getIterFn = __webpack_require__("27ee");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "551c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var global = __webpack_require__("7726");
var ctx = __webpack_require__("9b43");
var classof = __webpack_require__("23c6");
var $export = __webpack_require__("5ca1");
var isObject = __webpack_require__("d3f4");
var aFunction = __webpack_require__("d8e8");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var speciesConstructor = __webpack_require__("ebd6");
var task = __webpack_require__("1991").set;
var microtask = __webpack_require__("8079")();
var newPromiseCapabilityModule = __webpack_require__("a5b8");
var perform = __webpack_require__("9c80");
var userAgent = __webpack_require__("a25f");
var promiseResolve = __webpack_require__("bcaa");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("7f20")($Promise, PROMISE);
__webpack_require__("7a56")(PROMISE);
Wrapper = __webpack_require__("8378")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6537":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_city_selector_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("df5b");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_city_selector_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_city_selector_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_city_selector_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "71d5":
/***/ (function(module) {

module.exports = {"hot":[{"name":"北京","py":"bj","fullpy":"bei3jing1","id":131,"hot":1},{"name":"成都","py":"cd","fullpy":"cheng2dou1","id":75,"hot":1},{"name":"广州","py":"gz","fullpy":"guang3zhou1","id":257,"hot":1},{"name":"杭州","py":"hz","fullpy":"hang2zhou1","id":179,"hot":1},{"name":"上海","py":"sh","fullpy":"shang4hai3","id":289,"hot":1},{"name":"深圳","py":"sz","fullpy":"shen1zhen4","id":340,"hot":1},{"name":"武汉","py":"wh","fullpy":"wu3han4","id":218,"hot":1}],"A":[{"name":"阿坝藏族羌族自治州","py":"abzzqzzzz","fullpy":"a1ba4zang4zu2qiang1zu2zi4zhi4zhou1","id":185,"hot":0},{"name":"安康","py":"ak","fullpy":"an1kang1","id":324,"hot":0},{"name":"阿克苏地区","py":"aksdq","fullpy":"a1ke4su1di4qu1","id":85,"hot":0},{"name":"阿里地区","py":"aldq","fullpy":"a1li3di4qu1","id":103,"hot":0},{"name":"阿拉尔","py":"ale","fullpy":"a1la1er3","id":731,"hot":0},{"name":"阿拉善盟","py":"alsm","fullpy":"a1la1shan4meng2","id":230,"hot":0},{"name":"阿勒泰地区","py":"altdq","fullpy":"a1le4tai4di4qu1","id":96,"hot":0},{"name":"澳门","py":"am","fullpy":"ao4men2","id":2912,"hot":0},{"name":"安庆","py":"aq","fullpy":"an1qing4","id":130,"hot":0},{"name":"安顺","py":"as","fullpy":"an1shun4","id":263,"hot":0},{"name":"鞍山","py":"as","fullpy":"an1shan1","id":320,"hot":0},{"name":"安阳","py":"ay","fullpy":"an1yang2","id":267,"hot":0}],"B":[{"name":"蚌埠","py":"bb","fullpy":"bang4bu4","id":126,"hot":0},{"name":"白城","py":"bc","fullpy":"bai2cheng2","id":51,"hot":0},{"name":"保定","py":"bd","fullpy":"bao3ding4","id":307,"hot":0},{"name":"博尔塔拉蒙古自治州","py":"betlmgzzz","fullpy":"bo2er3ta3la1meng3gu3zi4zhi4zhou1","id":88,"hot":0},{"name":"北海","py":"bh","fullpy":"bei3hai3","id":295,"hot":0},{"name":"北京","py":"bj","fullpy":"bei3jing1","id":131,"hot":1},{"name":"宝鸡","py":"bj","fullpy":"bao3ji1","id":171,"hot":0},{"name":"毕节地区","py":"bjdq","fullpy":"bi4jie2di4qu1","id":206,"hot":0},{"name":"保山","py":"bs","fullpy":"bao3shan1","id":112,"hot":0},{"name":"白山","py":"bs","fullpy":"bai2shan1","id":57,"hot":0},{"name":"百色","py":"bs","fullpy":"bai3se4","id":203,"hot":0},{"name":"白沙黎族自治","py":"bslzzz","fullpy":"bai2sha1li2zu2zi4zhi4","id":2359,"hot":0},{"name":"包头","py":"bt","fullpy":"bao1tou2","id":229,"hot":0},{"name":"保亭黎族苗族自治","py":"btlzmzzz","fullpy":"bao3ting2li2zu2miao2zu2zi4zhi4","id":1217,"hot":0},{"name":"本溪","py":"bx","fullpy":"ben3xi1","id":227,"hot":0},{"name":"白银","py":"by","fullpy":"bai2yin2","id":35,"hot":0},{"name":"巴音郭楞蒙古自治州","py":"byglmgzzz","fullpy":"ba1yin1guo1leng2meng3gu3zi4zhi4zhou1","id":86,"hot":0},{"name":"巴彦淖尔","py":"byne","fullpy":"ba1yan4nao4er3","id":169,"hot":0},{"name":"亳州","py":"bz","fullpy":"bo2zhou1","id":188,"hot":0},{"name":"巴中","py":"bz","fullpy":"ba1zhong1","id":239,"hot":0},{"name":"滨州","py":"bz","fullpy":"bin1zhou1","id":235,"hot":0}],"C":[{"name":"常德","py":"cd","fullpy":"chang2de2","id":219,"hot":0},{"name":"成都","py":"cd","fullpy":"cheng2dou1","id":75,"hot":1},{"name":"承德","py":"cd","fullpy":"cheng2de2","id":207,"hot":0},{"name":"昌都地区","py":"cddq","fullpy":"chang1dou1di4qu1","id":99,"hot":0},{"name":"赤峰","py":"cf","fullpy":"chi4feng1","id":297,"hot":0},{"name":"巢湖","py":"ch","fullpy":"chao2hu2","id":251,"hot":0},{"name":"昌吉回族自治州","py":"cjhzzzz","fullpy":"chang1ji2hui2zu2zi4zhi4zhou1","id":93,"hot":0},{"name":"昌江黎族自治","py":"cjlzzz","fullpy":"chang1jiang1li2zu2zi4zhi4","id":1642,"hot":0},{"name":"澄迈","py":"cm","fullpy":"cheng2mai4","id":2757,"hot":0},{"name":"重庆","py":"cq","fullpy":"chong2qing4","id":132,"hot":0},{"name":"长沙","py":"cs","fullpy":"chang3sha1","id":158,"hot":0},{"name":"楚雄彝族自治州","py":"cxyzzzz","fullpy":"chu3xiong2yi2zu2zi4zhi4zhou1","id":105,"hot":0},{"name":"朝阳","py":"cy","fullpy":"chao2yang2","id":280,"hot":0},{"name":"崇左","py":"cz","fullpy":"chong2zuo3","id":144,"hot":0},{"name":"常州","py":"cz","fullpy":"chang2zhou1","id":348,"hot":0},{"name":"池州","py":"cz","fullpy":"chi2zhou1","id":299,"hot":0},{"name":"沧州","py":"cz","fullpy":"cang1zhou1","id":149,"hot":0},{"name":"滁州","py":"cz","fullpy":"chu2zhou1","id":189,"hot":0},{"name":"潮州","py":"cz","fullpy":"chao2zhou1","id":201,"hot":0},{"name":"郴州","py":"cz","fullpy":"chen1zhou1","id":275,"hot":0}],"D":[{"name":"定安","py":"da","fullpy":"ding4an1","id":1214,"hot":0},{"name":"丹东","py":"dd","fullpy":"dan1dong1","id":282,"hot":0},{"name":"东方","py":"df","fullpy":"dong1fang1","id":2634,"hot":0},{"name":"东莞","py":"dg","fullpy":"dong1guan1","id":119,"hot":0},{"name":"德宏傣族景颇族自治州","py":"dhdzjpzzzz","fullpy":"de2hong2dai3zu2jing3po1zu2zi4zhi4zhou1","id":116,"hot":0},{"name":"大连","py":"dl","fullpy":"da4lian2","id":167,"hot":0},{"name":"大理白族自治州","py":"dlbzzzz","fullpy":"da4li3bai2zu2zi4zhi4zhou1","id":111,"hot":0},{"name":"大庆","py":"dq","fullpy":"da4qing4","id":50,"hot":0},{"name":"迪庆藏族自治州","py":"dqzzzzz","fullpy":"di2qing4zang4zu2zi4zhi4zhou1","id":115,"hot":0},{"name":"大同","py":"dt","fullpy":"da4tong2","id":355,"hot":0},{"name":"定西","py":"dx","fullpy":"ding4xi1","id":136,"hot":0},{"name":"大兴安岭地区","py":"dxaldq","fullpy":"da4xing1an1ling3di4qu1","id":38,"hot":0},{"name":"东营","py":"dy","fullpy":"dong1ying2","id":174,"hot":0},{"name":"德阳","py":"dy","fullpy":"de2yang2","id":74,"hot":0},{"name":"儋州","py":"dz","fullpy":"dan1zhou1","id":1215,"hot":0},{"name":"德州","py":"dz","fullpy":"de2zhou1","id":372,"hot":0},{"name":"达州","py":"dz","fullpy":"da2zhou1","id":369,"hot":0}],"E":[{"name":"鄂尔多斯","py":"eeds","fullpy":"e4er3duo1si1","id":283,"hot":0},{"name":"恩施土家族苗族自治州","py":"estjzmzzzz","fullpy":"en1shi1tu3jia1zu2miao2zu2zi4zhi4zhou1","id":373,"hot":0},{"name":"鄂州","py":"ez","fullpy":"e4zhou1","id":122,"hot":0}],"F":[{"name":"防城港","py":"fcg","fullpy":"fang2cheng2gang3","id":204,"hot":0},{"name":"佛山","py":"fs","fullpy":"fo2shan1","id":138,"hot":0},{"name":"抚顺","py":"fs","fullpy":"fu3shun4","id":184,"hot":0},{"name":"阜新","py":"fx","fullpy":"fu4xin1","id":59,"hot":0},{"name":"阜阳","py":"fy","fullpy":"fu4yang2","id":128,"hot":0},{"name":"抚州","py":"fz","fullpy":"fu3zhou1","id":226,"hot":0},{"name":"福州","py":"fz","fullpy":"fu2zhou1","id":300,"hot":0}],"G":[{"name":"广安","py":"ga","fullpy":"guang3an1","id":241,"hot":0},{"name":"贵港","py":"gg","fullpy":"gui4gang3","id":341,"hot":0},{"name":"桂林","py":"gl","fullpy":"gui4lin2","id":142,"hot":0},{"name":"果洛藏族自治州","py":"glzzzzz","fullpy":"guo3luo4zang4zu2zi4zhi4zhou1","id":72,"hot":0},{"name":"甘南藏族自治州","py":"gnzzzzz","fullpy":"gan1nan2zang4zu2zi4zhi4zhou1","id":247,"hot":0},{"name":"高雄","py":"gx","fullpy":"gao1xiong2","id":802,"hot":0},{"name":"固原","py":"gy","fullpy":"gu4yuan2","id":246,"hot":0},{"name":"广元","py":"gy","fullpy":"guang3yuan2","id":329,"hot":0},{"name":"贵阳","py":"gy","fullpy":"gui4yang2","id":146,"hot":0},{"name":"广州","py":"gz","fullpy":"guang3zhou1","id":257,"hot":1},{"name":"赣州","py":"gz","fullpy":"gan4zhou1","id":365,"hot":0},{"name":"甘孜藏族自治州","py":"gzzzzzz","fullpy":"gan1zi1zang4zu2zi4zhi4zhou1","id":73,"hot":0}],"H":[{"name":"淮安","py":"ha","fullpy":"huai2an1","id":162,"hot":0},{"name":"淮北","py":"hb","fullpy":"huai2bei3","id":253,"hot":0},{"name":"鹤壁","py":"hb","fullpy":"he4bi4","id":215,"hot":0},{"name":"海北藏族自治州","py":"hbzzzzz","fullpy":"hai3bei3zang4zu2zi4zhi4zhou1","id":67,"hot":0},{"name":"河池","py":"hc","fullpy":"he2chi2","id":143,"hot":0},{"name":"邯郸","py":"hd","fullpy":"han2dan1","id":151,"hot":0},{"name":"海东地区","py":"hddq","fullpy":"hai3dong1di4qu1","id":69,"hot":0},{"name":"哈尔滨","py":"heb","fullpy":"ha1er3bin1","id":48,"hot":0},{"name":"合肥","py":"hf","fullpy":"he2fei2","id":127,"hot":0},{"name":"鹤岗","py":"hg","fullpy":"he4gang3","id":43,"hot":0},{"name":"黄冈","py":"hg","fullpy":"huang2gang1","id":271,"hot":0},{"name":"怀化","py":"hh","fullpy":"huai2hua4","id":363,"hot":0},{"name":"黑河","py":"hh","fullpy":"hei1he2","id":39,"hot":0},{"name":"红河哈尼族彝族自治州","py":"hhhnzyzzzz","fullpy":"hong2he2ha1ni2zu2yi2zu2zi4zhi4zhou1","id":107,"hot":0},{"name":"呼和浩特","py":"hhht","fullpy":"hu1he2hao4te4","id":321,"hot":0},{"name":"海口","py":"hk","fullpy":"hai3kou3","id":125,"hot":0},{"name":"花莲","py":"hl","fullpy":"hua1lian2","id":808,"hot":0},{"name":"呼伦贝尔","py":"hlbe","fullpy":"hu1lun2bei4er3","id":61,"hot":0},{"name":"葫芦岛","py":"hld","fullpy":"hu2lu2dao3","id":319,"hot":0},{"name":"哈密地区","py":"hmdq","fullpy":"ha1mi4di4qu1","id":91,"hot":0},{"name":"淮南","py":"hn","fullpy":"huai2nan2","id":250,"hot":0},{"name":"海南藏族自治州","py":"hnzzzzz","fullpy":"hai3nan2zang4zu2zi4zhi4zhou1","id":68,"hot":0},{"name":"黄南藏族自治州","py":"hnzzzzz","fullpy":"huang2nan2zang4zu2zi4zhi4zhou1","id":70,"hot":0},{"name":"黄浦","py":"hp","fullpy":"huang2pu3","id":11111,"hot":0},{"name":"衡水","py":"hs","fullpy":"heng2shui3","id":208,"hot":0},{"name":"黄山","py":"hs","fullpy":"huang2shan1","id":252,"hot":0},{"name":"黄石","py":"hs","fullpy":"huang2shi2","id":311,"hot":0},{"name":"和田地区","py":"htdq","fullpy":"he2tian2di4qu1","id":82,"hot":0},{"name":"海西蒙古族藏族自治州","py":"hxmgzzzzzz","fullpy":"hai3xi1meng3gu3zu2zang4zu2zi4zhi4zhou1","id":65,"hot":0},{"name":"河源","py":"hy","fullpy":"he2yuan2","id":200,"hot":0},{"name":"衡阳","py":"hy","fullpy":"heng2yang2","id":159,"hot":0},{"name":"惠州","py":"hz","fullpy":"hui4zhou1","id":301,"hot":0},{"name":"杭州","py":"hz","fullpy":"hang2zhou1","id":179,"hot":1},{"name":"汉中","py":"hz","fullpy":"han4zhong1","id":352,"hot":0},{"name":"湖州","py":"hz","fullpy":"hu2zhou1","id":294,"hot":0},{"name":"菏泽","py":"hz","fullpy":"he2ze2","id":353,"hot":0},{"name":"贺州","py":"hz","fullpy":"he4zhou1","id":260,"hot":0}],"J":[{"name":"吉安","py":"ja","fullpy":"ji2an1","id":318,"hot":0},{"name":"晋城","py":"jc","fullpy":"jin4cheng2","id":290,"hot":0},{"name":"金昌","py":"jc","fullpy":"jin1chang1","id":34,"hot":0},{"name":"景德镇","py":"jdz","fullpy":"jing3de2zhen4","id":225,"hot":0},{"name":"金华","py":"jh","fullpy":"jin1hua2","id":333,"hot":0},{"name":"九江","py":"jj","fullpy":"jiu3jiang1","id":349,"hot":0},{"name":"基隆","py":"jl","fullpy":"ji1long2","id":803,"hot":0},{"name":"吉林市","py":"jls","fullpy":"ji2lin2shi4","id":55,"hot":0},{"name":"江门","py":"jm","fullpy":"jiang1men2","id":302,"hot":0},{"name":"荆门","py":"jm","fullpy":"jing1men2","id":217,"hot":0},{"name":"金门","py":"jm","fullpy":"jin1men2","id":809,"hot":0},{"name":"佳木斯","py":"jms","fullpy":"jia1mu4si1","id":42,"hot":0},{"name":"济南","py":"jn","fullpy":"ji4nan2","id":288,"hot":0},{"name":"济宁","py":"jn","fullpy":"ji4ning2","id":286,"hot":0},{"name":"酒泉","py":"jq","fullpy":"jiu3quan2","id":37,"hot":0},{"name":"嘉兴","py":"jx","fullpy":"jia1xing1","id":334,"hot":0},{"name":"鸡西","py":"jx","fullpy":"ji1xi1","id":46,"hot":0},{"name":"嘉义","py":"jy","fullpy":"jia1yi4","id":807,"hot":0},{"name":"揭阳","py":"jy","fullpy":"jie1yang2","id":259,"hot":0},{"name":"嘉峪关","py":"jyg","fullpy":"jia1yu4guan1","id":33,"hot":0},{"name":"晋中","py":"jz","fullpy":"jin4zhong1","id":238,"hot":0},{"name":"焦作","py":"jz","fullpy":"jiao1zuo4","id":211,"hot":0},{"name":"荆州","py":"jz","fullpy":"jing1zhou1","id":157,"hot":0},{"name":"锦州","py":"jz","fullpy":"jin3zhou1","id":166,"hot":0}],"K":[{"name":"开封","py":"kf","fullpy":"kai1feng1","id":210,"hot":0},{"name":"克拉玛依","py":"klmy","fullpy":"ke4la1ma3yi1","id":95,"hot":0},{"name":"昆明","py":"km","fullpy":"kun1ming2","id":104,"hot":0},{"name":"喀什地区","py":"ksdq","fullpy":"ka1shen2di4qu1","id":83,"hot":0},{"name":"克孜勒苏柯尔克孜自治州","py":"kzlskekzzzz","fullpy":"ke4zi1le4su1ke1er3ke4zi1zi4zhi4zhou1","id":84,"hot":0}],"L":[{"name":"六安","py":"la","fullpy":"liu4an1","id":298,"hot":0},{"name":"来宾","py":"lb","fullpy":"lai2bin1","id":202,"hot":0},{"name":"临沧","py":"lc","fullpy":"lin2cang1","id":110,"hot":0},{"name":"聊城","py":"lc","fullpy":"liao2cheng2","id":366,"hot":0},{"name":"娄底","py":"ld","fullpy":"lou2di3","id":221,"hot":0},{"name":"乐东黎族自治","py":"ldlzzz","fullpy":"le4dong1li2zu2zi4zhi4","id":2032,"hot":0},{"name":"临汾","py":"lf","fullpy":"lin2fen2","id":368,"hot":0},{"name":"廊坊","py":"lf","fullpy":"lang2fang1","id":191,"hot":0},{"name":"临高","py":"lg","fullpy":"lin2gao1","id":2033,"hot":0},{"name":"漯河","py":"lh","fullpy":"luo4he2","id":344,"hot":0},{"name":"丽江","py":"lj","fullpy":"li4jiang1","id":114,"hot":0},{"name":"连江","py":"lj","fullpy":"lian2jiang1","id":810,"hot":0},{"name":"吕梁","py":"ll","fullpy":"lu:3liang2","id":327,"hot":0},{"name":"陇南","py":"ln","fullpy":"long3nan2","id":256,"hot":0},{"name":"六盘水","py":"lps","fullpy":"liu4pan2shui3","id":147,"hot":0},{"name":"丽水","py":"ls","fullpy":"li4shui3","id":292,"hot":0},{"name":"乐山","py":"ls","fullpy":"le4shan1","id":79,"hot":0},{"name":"拉萨","py":"ls","fullpy":"la1sa4","id":100,"hot":0},{"name":"陵水黎族自治","py":"lslzzz","fullpy":"ling2shui3li2zu2zi4zhi4","id":1643,"hot":0},{"name":"凉山彝族自治州","py":"lsyzzzz","fullpy":"liang2shan1yi2zu2zi4zhi4zhou1","id":80,"hot":0},{"name":"莱芜","py":"lw","fullpy":"lai2wu2","id":124,"hot":0},{"name":"临夏回族自治州","py":"lxhzzzz","fullpy":"lin2xia4hui2zu2zi4zhi4zhou1","id":182,"hot":0},{"name":"临沂","py":"ly","fullpy":"lin2yi2","id":234,"hot":0},{"name":"洛阳","py":"ly","fullpy":"luo4yang2","id":153,"hot":0},{"name":"辽源","py":"ly","fullpy":"liao2yuan2","id":183,"hot":0},{"name":"辽阳","py":"ly","fullpy":"liao2yang2","id":351,"hot":0},{"name":"龙岩","py":"ly","fullpy":"long2yan2","id":193,"hot":0},{"name":"连云港","py":"lyg","fullpy":"lian2yun2gang3","id":347,"hot":0},{"name":"兰州","py":"lz","fullpy":"lan2zhou1","id":36,"hot":0},{"name":"柳州","py":"lz","fullpy":"liu3zhou1","id":305,"hot":0},{"name":"泸州","py":"lz","fullpy":"lu2zhou1","id":331,"hot":0},{"name":"林芝地区","py":"lzdq","fullpy":"lin2zhi1di4qu1","id":98,"hot":0}],"M":[{"name":"马鞍山","py":"mas","fullpy":"ma3an1shan1","id":358,"hot":0},{"name":"牡丹江","py":"mdj","fullpy":"mu3dan1jiang1","id":49,"hot":0},{"name":"苗栗","py":"ml","fullpy":"miao2li4","id":811,"hot":0},{"name":"茂名","py":"mm","fullpy":"mao4ming2","id":139,"hot":0},{"name":"眉山","py":"ms","fullpy":"mei2shan1","id":77,"hot":0},{"name":"绵阳","py":"my","fullpy":"mian2yang2","id":240,"hot":0},{"name":"梅州","py":"mz","fullpy":"mei2zhou1","id":141,"hot":0}],"N":[{"name":"宁波","py":"nb","fullpy":"ning2bo1","id":180,"hot":0},{"name":"南充","py":"nc","fullpy":"nan2chong1","id":291,"hot":0},{"name":"南昌","py":"nc","fullpy":"nan2chang1","id":163,"hot":0},{"name":"宁德","py":"nd","fullpy":"ning2de2","id":192,"hot":0},{"name":"内江","py":"nj","fullpy":"nei4jiang1","id":248,"hot":0},{"name":"南京","py":"nj","fullpy":"nan2jing1","id":315,"hot":0},{"name":"怒江傈僳族自治州","py":"njlszzzz","fullpy":"nu4jiang1li4su4zu2zi4zhi4zhou1","id":113,"hot":0},{"name":"南宁","py":"nn","fullpy":"nan2ning2","id":261,"hot":0},{"name":"南平","py":"np","fullpy":"nan2ping2","id":133,"hot":0},{"name":"那曲地区","py":"nqdq","fullpy":"nei4qu3di4qu1","id":101,"hot":0},{"name":"南投","py":"nt","fullpy":"nan2tou2","id":812,"hot":0},{"name":"南通","py":"nt","fullpy":"nan2tong1","id":161,"hot":0},{"name":"南阳","py":"ny","fullpy":"nan2yang2","id":309,"hot":0}],"P":[{"name":"屏东","py":"pd","fullpy":"ping2dong1","id":813,"hot":0},{"name":"平顶山","py":"pds","fullpy":"ping2ding3shan1","id":213,"hot":0},{"name":"普洱","py":"pe","fullpy":"pu3er3","id":108,"hot":0},{"name":"澎湖","py":"ph","fullpy":"peng2hu2","id":814,"hot":0},{"name":"盘锦","py":"pj","fullpy":"pan2jin3","id":228,"hot":0},{"name":"平凉","py":"pl","fullpy":"ping2liang2","id":359,"hot":0},{"name":"莆田","py":"pt","fullpy":"pu2tian2","id":195,"hot":0},{"name":"萍乡","py":"px","fullpy":"ping2xiang1","id":350,"hot":0},{"name":"濮阳","py":"py","fullpy":"pu2yang2","id":209,"hot":0},{"name":"攀枝花","py":"pzh","fullpy":"pan1zhi1hua1","id":81,"hot":0}],"Q":[{"name":"青岛","py":"qd","fullpy":"qing1dao3","id":236,"hot":0},{"name":"黔东南苗族侗族自治州","py":"qdnmzdzzzz","fullpy":"qian2dong1nan2miao2zu2dong4zu2zi4zhi4zhou1","id":342,"hot":0},{"name":"琼海","py":"qh","fullpy":"qiong2hai3","id":2358,"hot":0},{"name":"秦皇岛","py":"qhd","fullpy":"qin2huang2dao3","id":148,"hot":0},{"name":"曲靖","py":"qj","fullpy":"qu3jing4","id":249,"hot":0},{"name":"潜江","py":"qj","fullpy":"qian2jiang1","id":1293,"hot":0},{"name":"黔南布依族苗族自治州","py":"qnbyzmzzzz","fullpy":"qian2nan2bu4yi1zu2miao2zu2zi4zhi4zhou1","id":306,"hot":0},{"name":"齐齐哈尔","py":"qqhe","fullpy":"qi2qi2ha1er3","id":41,"hot":0},{"name":"其他","py":"qt","fullpy":"qi2ta1","id":100000,"hot":0},{"name":"七台河","py":"qth","fullpy":"qi1tai2he2","id":47,"hot":0},{"name":"黔西南布依族苗族自治州","py":"qxnbyzmzzzz","fullpy":"qian2xi1nan2bu4yi1zu2miao2zu2zi4zhi4zhou1","id":343,"hot":0},{"name":"庆阳","py":"qy","fullpy":"qing4yang2","id":135,"hot":0},{"name":"清远","py":"qy","fullpy":"qing1yuan3","id":197,"hot":0},{"name":"泉州","py":"qz","fullpy":"quan2zhou1","id":134,"hot":0},{"name":"衢州","py":"qz","fullpy":"qu2zhou1","id":243,"hot":0},{"name":"钦州","py":"qz","fullpy":"qin1zhou1","id":145,"hot":0},{"name":"琼中黎族苗族自治","py":"qzlzmzzz","fullpy":"qiong2zhong1li2zu2miao2zu2zi4zhi4","id":2031,"hot":0}],"R":[{"name":"日喀则地区","py":"rkzdq","fullpy":"ri4ka1ze2di4qu1","id":102,"hot":0},{"name":"日照","py":"rz","fullpy":"ri4zhao4","id":173,"hot":0}],"S":[{"name":"韶关","py":"sg","fullpy":"shao2guan1","id":137,"hot":0},{"name":"上海","py":"sh","fullpy":"shang4hai3","id":289,"hot":1},{"name":"绥化","py":"sh","fullpy":"sui2hua4","id":44,"hot":0},{"name":"石河子","py":"shz","fullpy":"shi2he2zi5","id":770,"hot":0},{"name":"石家庄","py":"sjz","fullpy":"shi2jia1zhuang1","id":150,"hot":0},{"name":"商洛","py":"sl","fullpy":"shang1luo4","id":285,"hot":0},{"name":"三明","py":"sm","fullpy":"san1ming2","id":254,"hot":0},{"name":"三门峡","py":"smx","fullpy":"san1men2xia2","id":212,"hot":0},{"name":"遂宁","py":"sn","fullpy":"sui4ning2","id":330,"hot":0},{"name":"山南地区","py":"sndq","fullpy":"shan1nan2di4qu1","id":97,"hot":0},{"name":"神农架林区","py":"snjlq","fullpy":"shen2nong2jia4lin2qu1","id":2734,"hot":0},{"name":"四平","py":"sp","fullpy":"si4ping2","id":56,"hot":0},{"name":"商丘","py":"sq","fullpy":"shang1qiu1","id":154,"hot":0},{"name":"宿迁","py":"sq","fullpy":"su4qian1","id":277,"hot":0},{"name":"上饶","py":"sr","fullpy":"shang4rao2","id":364,"hot":0},{"name":"汕头","py":"st","fullpy":"shan4tou2","id":303,"hot":0},{"name":"汕尾","py":"sw","fullpy":"shan4wei3","id":339,"hot":0},{"name":"绍兴","py":"sx","fullpy":"shao4xing1","id":293,"hot":0},{"name":"三亚","py":"sy","fullpy":"san1ya4","id":121,"hot":0},{"name":"十堰","py":"sy","fullpy":"shi2yan4","id":216,"hot":0},{"name":"松原","py":"sy","fullpy":"song1yuan2","id":52,"hot":0},{"name":"沈阳","py":"sy","fullpy":"shen3yang2","id":58,"hot":0},{"name":"邵阳","py":"sy","fullpy":"shao4yang2","id":273,"hot":0},{"name":"双鸭山","py":"sys","fullpy":"shuang1ya1shan1","id":45,"hot":0},{"name":"宿州","py":"sz","fullpy":"su4zhou1","id":370,"hot":0},{"name":"朔州","py":"sz","fullpy":"shuo4zhou1","id":237,"hot":0},{"name":"深圳","py":"sz","fullpy":"shen1zhen4","id":340,"hot":1},{"name":"苏州","py":"sz","fullpy":"su1zhou1","id":224,"hot":0},{"name":"随州","py":"sz","fullpy":"sui2zhou1","id":371,"hot":0},{"name":"石嘴山","py":"szs","fullpy":"shi2zui3shan1","id":335,"hot":0}],"T":[{"name":"泰安","py":"ta","fullpy":"tai4an1","id":325,"hot":0},{"name":"台北","py":"tb","fullpy":"tai2bei3","id":801,"hot":0},{"name":"屯昌","py":"tc","fullpy":"tun2chang1","id":1641,"hot":0},{"name":"铜川","py":"tc","fullpy":"tong2chuan1","id":232,"hot":0},{"name":"塔城地区","py":"tcdq","fullpy":"ta3cheng2di4qu1","id":94,"hot":0},{"name":"台东","py":"td","fullpy":"tai2dong1","id":815,"hot":0},{"name":"通化","py":"th","fullpy":"tong1hua4","id":165,"hot":0},{"name":"天津","py":"tj","fullpy":"tian1jin1","id":332,"hot":0},{"name":"通辽","py":"tl","fullpy":"tong1liao2","id":64,"hot":0},{"name":"铁岭","py":"tl","fullpy":"tie3ling3","id":60,"hot":0},{"name":"铜陵","py":"tl","fullpy":"tong2ling2","id":337,"hot":0},{"name":"吐鲁番地区","py":"tlfdq","fullpy":"tu3lu3fan1di4qu1","id":89,"hot":0},{"name":"天门","py":"tm","fullpy":"tian1men2","id":2654,"hot":0},{"name":"图木舒克","py":"tmsk","fullpy":"tu2mu4shu1ke4","id":792,"hot":0},{"name":"台南","py":"tn","fullpy":"tai2nan2","id":805,"hot":0},{"name":"铜仁地区","py":"trdq","fullpy":"tong2ren2di4qu1","id":205,"hot":0},{"name":"唐山","py":"ts","fullpy":"tang2shan1","id":265,"hot":0},{"name":"天水","py":"ts","fullpy":"tian1shui3","id":196,"hot":0},{"name":"太原","py":"ty","fullpy":"tai4yuan2","id":176,"hot":0},{"name":"桃源","py":"ty","fullpy":"tao2yuan2","id":816,"hot":0},{"name":"台中","py":"tz","fullpy":"tai2zhong1","id":804,"hot":0},{"name":"台州","py":"tz","fullpy":"tai2zhou1","id":244,"hot":0},{"name":"泰州","py":"tz","fullpy":"tai4zhou1","id":276,"hot":0}],"W":[{"name":"文昌","py":"wc","fullpy":"wen2chang1","id":2758,"hot":0},{"name":"潍坊","py":"wf","fullpy":"wei2fang1","id":287,"hot":0},{"name":"乌海","py":"wh","fullpy":"wu1hai3","id":123,"hot":0},{"name":"威海","py":"wh","fullpy":"wei1hai3","id":175,"hot":0},{"name":"武汉","py":"wh","fullpy":"wu3han4","id":218,"hot":1},{"name":"芜湖","py":"wh","fullpy":"wu2hu2","id":129,"hot":0},{"name":"五家渠","py":"wjq","fullpy":"wu3jia1qu2","id":789,"hot":0},{"name":"乌兰察布","py":"wlcb","fullpy":"wu1lan2cha2bu4","id":168,"hot":0},{"name":"乌鲁木齐","py":"wlmq","fullpy":"wu1lu3mu4qi2","id":92,"hot":0},{"name":"万宁","py":"wn","fullpy":"wan4ning2","id":1216,"hot":0},{"name":"渭南","py":"wn","fullpy":"wei4nan2","id":170,"hot":0},{"name":"文山壮族苗族自治州","py":"wszzmzzzz","fullpy":"wen2shan1zhuang4zu2miao2zu2zi4zhi4zhou1","id":177,"hot":0},{"name":"武威","py":"ww","fullpy":"wu3wei1","id":118,"hot":0},{"name":"无锡","py":"wx","fullpy":"wu2xi1","id":317,"hot":0},{"name":"吴忠","py":"wz","fullpy":"wu2zhong1","id":322,"hot":0},{"name":"梧州","py":"wz","fullpy":"wu2zhou1","id":304,"hot":0},{"name":"温州","py":"wz","fullpy":"wen1zhou1","id":178,"hot":0},{"name":"五指山","py":"wzs","fullpy":"wu3zhi3shan1","id":1644,"hot":0}],"X":[{"name":"西安","py":"xa","fullpy":"xi1an1","id":233,"hot":0},{"name":"兴安盟","py":"xam","fullpy":"xing1an1meng2","id":62,"hot":0},{"name":"新北","py":"xb","fullpy":"xin1bei3","id":817,"hot":0},{"name":"宣城","py":"xc","fullpy":"xuan1cheng2","id":190,"hot":0},{"name":"许昌","py":"xc","fullpy":"xu3chang1","id":155,"hot":0},{"name":"孝感","py":"xg","fullpy":"xiao4gan3","id":310,"hot":0},{"name":"香港","py":"xg","fullpy":"xiang1gang3","id":2911,"hot":0},{"name":"锡林郭勒盟","py":"xlglm","fullpy":"xi1lin2guo1le4meng2","id":63,"hot":0},{"name":"厦门","py":"xm","fullpy":"xia4men2","id":194,"hot":0},{"name":"咸宁","py":"xn","fullpy":"xian2ning2","id":362,"hot":0},{"name":"西宁","py":"xn","fullpy":"xi1ning2","id":66,"hot":0},{"name":"西双版纳傣族自治州","py":"xsbndzzzz","fullpy":"xi1shuang1ban3na4dai3zu2zi4zhi4zhou1","id":109,"hot":0},{"name":"仙桃","py":"xt","fullpy":"xian1tao2","id":1713,"hot":0},{"name":"湘潭","py":"xt","fullpy":"xiang1tan2","id":313,"hot":0},{"name":"邢台","py":"xt","fullpy":"xing2tai2","id":266,"hot":0},{"name":"新乡","py":"xx","fullpy":"xin1xiang1","id":152,"hot":0},{"name":"湘西土家族苗族自治州","py":"xxtjzmzzzz","fullpy":"xiang1xi1tu3jia1zu2miao2zu2zi4zhi4zhou1","id":274,"hot":0},{"name":"信阳","py":"xy","fullpy":"xin4yang2","id":214,"hot":0},{"name":"咸阳","py":"xy","fullpy":"xian2yang2","id":323,"hot":0},{"name":"新余","py":"xy","fullpy":"xin1yu2","id":164,"hot":0},{"name":"襄阳","py":"xy","fullpy":"xiang1yang2","id":156,"hot":0},{"name":"徐州","py":"xz","fullpy":"xu2zhou1","id":316,"hot":0},{"name":"忻州","py":"xz","fullpy":"xin1zhou1","id":367,"hot":0},{"name":"新竹","py":"xz","fullpy":"xin1zhu2","id":806,"hot":0}],"Y":[{"name":"延安","py":"ya","fullpy":"yan2an1","id":284,"hot":0},{"name":"雅安","py":"ya","fullpy":"ya3an1","id":76,"hot":0},{"name":"宜宾","py":"yb","fullpy":"yi2bin1","id":186,"hot":0},{"name":"延边朝鲜族自治州","py":"ybcxzzzz","fullpy":"yan2bian1chao2xian1zu2zi4zhi4zhou1","id":54,"hot":0},{"name":"伊春","py":"yc","fullpy":"yi1chun1","id":40,"hot":0},{"name":"宜昌","py":"yc","fullpy":"yi2chang1","id":270,"hot":0},{"name":"宜春","py":"yc","fullpy":"yi2chun1","id":278,"hot":0},{"name":"盐城","py":"yc","fullpy":"yan2cheng2","id":223,"hot":0},{"name":"运城","py":"yc","fullpy":"yun4cheng2","id":328,"hot":0},{"name":"银川","py":"yc","fullpy":"yin2chuan1","id":360,"hot":0},{"name":"云浮","py":"yf","fullpy":"yun2fu2","id":258,"hot":0},{"name":"阳江","py":"yj","fullpy":"yang2jiang1","id":199,"hot":0},{"name":"营口","py":"yk","fullpy":"ying2kou3","id":281,"hot":0},{"name":"云林","py":"yl","fullpy":"yun2lin2","id":818,"hot":0},{"name":"宜兰","py":"yl","fullpy":"yi2lan2","id":819,"hot":0},{"name":"榆林","py":"yl","fullpy":"yu2lin2","id":231,"hot":0},{"name":"玉林","py":"yl","fullpy":"yu4lin2","id":361,"hot":0},{"name":"伊犁哈萨克自治州","py":"ylhskzzz","fullpy":"yi1li2ha1sa4ke4zi4zhi4zhou1","id":90,"hot":0},{"name":"阳泉","py":"yq","fullpy":"yang2quan2","id":357,"hot":0},{"name":"玉树藏族自治州","py":"yszzzzz","fullpy":"yu4shu4zang4zu2zi4zhi4zhou1","id":71,"hot":0},{"name":"烟台","py":"yt","fullpy":"yan1tai2","id":326,"hot":0},{"name":"鹰潭","py":"yt","fullpy":"ying1tan2","id":279,"hot":0},{"name":"玉溪","py":"yx","fullpy":"yu4xi1","id":106,"hot":0},{"name":"岳阳","py":"yy","fullpy":"yue4yang2","id":220,"hot":0},{"name":"益阳","py":"yy","fullpy":"yi4yang2","id":272,"hot":0},{"name":"扬州","py":"yz","fullpy":"yang2zhou1","id":346,"hot":0},{"name":"永州","py":"yz","fullpy":"yong3zhou1","id":314,"hot":0}],"Z":[{"name":"淄博","py":"zb","fullpy":"zi1bo2","id":354,"hot":0},{"name":"长春","py":"zc","fullpy":"zhang3chun1","id":53,"hot":0},{"name":"自贡","py":"zg","fullpy":"zi4gong4","id":78,"hot":0},{"name":"彰化","py":"zh","fullpy":"zhang1hua4","id":820,"hot":0},{"name":"珠海","py":"zh","fullpy":"zhu1hai3","id":140,"hot":0},{"name":"湛江","py":"zj","fullpy":"zhan4jiang1","id":198,"hot":0},{"name":"镇江","py":"zj","fullpy":"zhen4jiang1","id":160,"hot":0},{"name":"张家界","py":"zjj","fullpy":"zhang1jia1jie4","id":312,"hot":0},{"name":"张家口","py":"zjk","fullpy":"zhang1jia1kou3","id":264,"hot":0},{"name":"周口","py":"zk","fullpy":"zhou1kou3","id":308,"hot":0},{"name":"驻马店","py":"zmd","fullpy":"zhu4ma3dian4","id":269,"hot":0},{"name":"肇庆","py":"zq","fullpy":"zhao4qing4","id":338,"hot":0},{"name":"中山","py":"zs","fullpy":"zhong1shan1","id":187,"hot":0},{"name":"舟山","py":"zs","fullpy":"zhou1shan1","id":245,"hot":0},{"name":"昭通","py":"zt","fullpy":"zhao1tong1","id":336,"hot":0},{"name":"中卫","py":"zw","fullpy":"zhong1wei4","id":181,"hot":0},{"name":"张掖","py":"zy","fullpy":"zhang1ye4","id":117,"hot":0},{"name":"资阳","py":"zy","fullpy":"zi1yang2","id":242,"hot":0},{"name":"遵义","py":"zy","fullpy":"zun1yi4","id":262,"hot":0},{"name":"枣庄","py":"zz","fullpy":"zao3zhuang1","id":172,"hot":0},{"name":"株洲","py":"zz","fullpy":"zhu1zhou1","id":222,"hot":0},{"name":"漳州","py":"zz","fullpy":"zhang1zhou1","id":255,"hot":0},{"name":"郑州","py":"zz","fullpy":"zheng4zhou1","id":268,"hot":0},{"name":"长治","py":"zz","fullpy":"zhang3zhi4","id":356,"hot":0}]};

/***/ }),

/***/ "7514":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7cdf":
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__("5ca1");

$export($export.S, 'Number', { isInteger: __webpack_require__("9c12") });


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8079":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var macrotask = __webpack_require__("1991").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("2d95")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c12":
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__("d3f4");
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9c80":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a25f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "a5b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("d8e8");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("520a");
__webpack_require__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "bcaa":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var newPromiseCapability = __webpack_require__("a5b8");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "dcbc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("2aba");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "df5b":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("27c9");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("00320e70", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e67d":
/***/ (function(module, exports) {

function validate(binding) {
  if (typeof binding.value !== 'function') {
    console.warn('[Vue-click-outside:] provided expression', binding.expression, 'is not a function.')
    return false
  }

  return true
}

function isPopup(popupItem, elements) {
  if (!popupItem || !elements)
    return false

  for (var i = 0, len = elements.length; i < len; i++) {
    try {
      if (popupItem.contains(elements[i])) {
        return true
      }
      if (elements[i].contains(popupItem)) {
        return false
      }
    } catch(e) {
      return false
    }
  }

  return false
}

function isServer(vNode) {
  return typeof vNode.componentInstance !== 'undefined' && vNode.componentInstance.$isServer
}

exports = module.exports = {
  bind: function (el, binding, vNode) {
    if (!validate(binding)) return

    // Define Handler and cache it on the element
    function handler(e) {
      if (!vNode.context) return

      // some components may have related popup item, on which we shall prevent the click outside event handler.
      var elements = e.path || (e.composedPath && e.composedPath())
      elements && elements.length > 0 && elements.unshift(e.target)
      
      if (el.contains(e.target) || isPopup(vNode.context.popupItem, elements)) return

      el.__vueClickOutside__.callback(e)
    }

    // add Event Listeners
    el.__vueClickOutside__ = {
      handler: handler,
      callback: binding.value
    }
    !isServer(vNode) && document.addEventListener('click', handler)
  },

  update: function (el, binding) {
    if (validate(binding)) el.__vueClickOutside__.callback = binding.value
  },
  
  unbind: function (el, binding, vNode) {
    // Remove Event Listeners
    !isServer(vNode) && document.removeEventListener('click', el.__vueClickOutside__.handler)
    delete el.__vueClickOutside__
  }
}


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "f605":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("551c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.promise.finally.js
var es7_promise_finally = __webpack_require__("097d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"541353ce-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/city-selector/src/city-selector.vue?vue&type=template&id=27fb6eab&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"v-city-selector"},[_c('el-popover',{attrs:{"placement":"bottom","trigger":"manual","popper-class":"v-city-selector-popper"},model:{value:(_vm.showPopover),callback:function ($$v) {_vm.showPopover=$$v},expression:"showPopover"}},[_c('div',{attrs:{"slot":"reference"},slot:"reference"},[_c('el-select',{staticStyle:{"width":"100%"},attrs:{"placeholder":_vm.placeholder,"clearable":!_vm.multiple && _vm.clearable,"multiple":_vm.multiple,"popper-class":"v-city-selector-popper-hide","disabled":_vm.disabled,"size":_vm.size},on:{"remove-tag":_vm.handleRemoveTag,"focus":_vm.handleFocus,"clear":_vm.handleClear},model:{value:(_vm.selectedValue),callback:function ($$v) {_vm.selectedValue=$$v},expression:"selectedValue"}},[_vm._l((_vm.selectedOptions),function(item,index){return [_c('el-option',{key:index,attrs:{"label":item.name,"value":item.id}})]})],2)],1),_c('div',{directives:[{name:"click-outside",rawName:"v-click-outside",value:(_vm.hidePopover),expression:"hidePopover"}]},[_c('div',{staticClass:"v-city-selector-wrapper"},[_c('ul',{staticClass:"v-city-selector-tags"},_vm._l((_vm.tagsArr),function(item,index){return _c('li',{key:index,class:{'z-on': item == _vm.tagKey},on:{"click":function($event){_vm.tagKey = item}}},[_vm._v("\n            "+_vm._s(item)+"\n          ")])}),0),_c('div',{staticClass:"v-city-selector-list"},_vm._l((_vm.cityList),function(citys,initial){return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.currTag.includes(initial)),expression:"currTag.includes(initial)"}],key:initial},[(initial != 'hot')?_c('h6',[_vm._v("\n              "+_vm._s(initial)+"\n            ")]):_vm._e(),_c('ul',_vm._l((citys),function(v){return _c('li',{key:v.id,attrs:{"title":v.name},on:{"click":function($event){_vm.checkedChange(v)}}},[_vm._v("\n                "+_vm._s(v.name)+"\n              ")])}),0)])}),0)])])])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./packages/city-selector/src/city-selector.vue?vue&type=template&id=27fb6eab&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find-index.js
var es6_array_find_index = __webpack_require__("20d6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.is-integer.js
var es6_number_is_integer = __webpack_require__("7cdf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("28a5");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// EXTERNAL MODULE: ./node_modules/vue-click-outside/index.js
var vue_click_outside = __webpack_require__("e67d");
var vue_click_outside_default = /*#__PURE__*/__webpack_require__.n(vue_click_outside);

// EXTERNAL MODULE: ./packages/city-selector/src/city-selector-data.json
var city_selector_data = __webpack_require__("71d5");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/city-selector/src/city-selector.vue?vue&type=script&lang=js&









//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var city_selectorvue_type_script_lang_js_ = ({
  name: 'VCitySelector',
  directives: {
    ClickOutside: vue_click_outside_default.a
  },
  props: {
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    var tagsArr = ['热门', 'ABCDE', 'FGHJ', 'KLMN', 'PQRST', 'WXYZ'];
    var tags = [];
    tagsArr.forEach(function (item) {
      if (item === '热门') {
        tags[item] = ['hot'];
      } else {
        tags[item] = item.split('');
      }
    });
    return {
      showPopover: false,
      selectedOptions: [],
      selectedValue: '',
      selectedName: '',
      cityList: city_selector_data,
      tagsArr: tagsArr,
      tags: tags,
      tagKey: '热门',
      hasInitModel: false
    };
  },
  watch: {
    value: {
      deep: true,
      handler: function handler() {
        if (!this.hasInitModel) {
          this.initDatas();
          this.hasInitModel = true;
        }
      }
    }
  },
  computed: {
    currTag: function currTag() {
      var tagKey = this.tagKey,
          tags = this.tags;
      return tags[tagKey];
    }
  },
  created: function created() {
    this.initDatas();
  },
  methods: {
    // 初始化
    initDatas: function initDatas() {
      this.recursiveOpt(this.cityList);
    },
    recursiveOpt: function recursiveOpt(cityList) {
      var _this = this;

      var _selectedOptions = [];

      if (this.multiple) {
        // 多选
        if (!Array.isArray(this.value)) throw new Error('"value" is not Array');
        this.value.forEach(function (item) {
          var _city = '';
          Object.keys(cityList).forEach(function (key) {
            if (_city || key === 'hot') return;
            _city = cityList[key].find(function (city) {
              return city.id === item;
            });
          });

          _selectedOptions.push({
            id: _city.id,
            name: _city.name
          });
        }); // 初始化选中值

        this.selectedValue = _selectedOptions.map(function (item) {
          return item.id;
        });
      } else {
        // 单选
        if (!Number.isInteger(this.value)) throw new Error('"value" is not Integer');
        var _city = '';
        Object.keys(cityList).forEach(function (key) {
          if (_city || key === 'hot') return;
          _city = cityList[key].find(function (city) {
            return city.id === _this.value;
          });
        });

        _selectedOptions.push({
          id: _city.id,
          name: _city.name
        }); // 初始化选中值


        this.selectedValue = '';

        if (_selectedOptions.length > 0) {
          this.selectedValue = _selectedOptions[0].id;
        }
      }

      this.selectedOptions = _selectedOptions;
    },
    // 同步数据到上层
    syncData: function syncData() {
      if (this.multiple) {
        this.selectedValue = this.selectedOptions.map(function (item) {
          return item.id;
        });
        this.$emit('change', this.selectedOptions);
      } else {
        this.selectedValue = '';
        var selectedName = '';

        if (this.selectedOptions.length > 0) {
          this.selectedValue = this.selectedOptions[0].id;
          selectedName = this.selectedOptions[0].name;
        }

        this.$emit('change', this.selectedValue, selectedName);
      }
    },
    // 选中变化
    checkedChange: function checkedChange(_ref) {
      var id = _ref.id,
          name = _ref.name;

      if (this.multiple) {
        var isExist = this.selectedOptions.findIndex(function (option) {
          return option.id === id;
        });

        if ((this.multipleLimit <= 0 || this.multipleLimit > this.selectedOptions.length) && 0 > isExist) {
          this.selectedOptions.push({
            id: id,
            name: name
          });
        }
      } else {
        this.selectedOptions = [{
          id: id,
          name: name
        }];
      }

      this.hidePopover();
      this.syncData();
    },
    // 多选移除标签
    handleRemoveTag: function handleRemoveTag(id) {
      var idx = this.selectedOptions.findIndex(function (option) {
        return option.id === id;
      });

      if (idx > -1) {
        this.selectedOptions.splice(idx, 1);
      }

      this.syncData();
    },
    handleFocus: function handleFocus(evt) {
      if (this.disabled) return;
      this.showPopover = true;
      this.$emit('focus', evt);
    },
    handleClear: function handleClear() {
      this.selectedOptions = [];
      this.syncData();
    },
    hidePopover: function hidePopover(evt) {
      this.showPopover = false;
      this.$emit('blur', evt);
    }
  }
});
// CONCATENATED MODULE: ./packages/city-selector/src/city-selector.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_city_selectorvue_type_script_lang_js_ = (city_selectorvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./packages/city-selector/src/city-selector.vue?vue&type=style&index=0&lang=css&
var city_selectorvue_type_style_index_0_lang_css_ = __webpack_require__("6537");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./packages/city-selector/src/city-selector.vue






/* normalize component */

var component = normalizeComponent(
  src_city_selectorvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "city-selector.vue"
/* harmony default export */ var city_selector = (component.exports);
// CONCATENATED MODULE: ./packages/city-selector/index.js










city_selector.install = function (Vue) {
  Vue.component(city_selector.name, city_selector);
};

/* harmony default export */ var packages_city_selector = (city_selector);
// CONCATENATED MODULE: ./packages/index.js




var packages_install = function install(Vue) {
  // 判断是否安装
  if (install.installed) return; // 遍历注册全局组件

  Vue.component(packages_city_selector.name, packages_city_selector);
};

if (typeof window !== 'undefined' && window.Vue) {
  packages_install(window.Vue);
}

/* harmony default export */ var packages_0 = ({
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install: packages_install,
  // 以下是具体的组件列表
  CitySelector: packages_city_selector
});
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (packages_0);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ });
//# sourceMappingURL=vue-city-selector.common.js.map