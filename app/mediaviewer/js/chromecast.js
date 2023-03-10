/*! videojs-chromecast-extended 2019-05-05 v1.1.4 */

(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a;
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];
                    return o(n || r);
                }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
    }
    return r;
})()({
    1: [function (require, module, exports) {
        (function () {
            var initializing = false, fnTest = /xyz/.test(function () {
                xyz;
            }) ? /\b_super\b/ : /.*/;
            this.Class = function () { };
            Class.extend = function (className, prop) {
                if (prop == undefined) {
                    prop = className;
                    className = "Class";
                }
                var _super = this.prototype;
                initializing = true;
                var prototype = new this();
                initializing = false;
                for (var name in prop) {
                    prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function (name, fn) {
                        return function () {
                            var tmp = this._super;
                            this._super = _super[name];
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;
                            return ret;
                        };
                    }(name, prop[name]) : prop[name];
                }
                function Class() {
                    if (!initializing && this.init) this.init.apply(this, arguments);
                }
                Class.prototype = prototype;
                var func = new Function("return function " + className + "(){ }")();
                Class.prototype.constructor = func;
                Class.extend = arguments.callee;
                return Class;
            };
            module.exports = Class;
        })();
    }, {}],
    2: [function (require, module, exports) {
        (function () {
            var root = this;
            var previousUnderscore = root._;
            var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
            var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
            var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind, nativeCreate = Object.create;
            var Ctor = function () { };
            var _ = function (obj) {
                if (obj instanceof _) return obj;
                if (!(this instanceof _)) return new _(obj);
                this._wrapped = obj;
            };
            if (typeof exports !== "undefined") {
                if (typeof module !== "undefined" && module.exports) {
                    exports = module.exports = _;
                }
                exports._ = _;
            } else {
                root._ = _;
            }
            _.VERSION = "1.8.3";
            var optimizeCb = function (func, context, argCount) {
                if (context === void 0) return func;
                switch (argCount == null ? 3 : argCount) {
                    case 1:
                        return function (value) {
                            return func.call(context, value);
                        };

                    case 2:
                        return function (value, other) {
                            return func.call(context, value, other);
                        };

                    case 3:
                        return function (value, index, collection) {
                            return func.call(context, value, index, collection);
                        };

                    case 4:
                        return function (accumulator, value, index, collection) {
                            return func.call(context, accumulator, value, index, collection);
                        };
                }
                return function () {
                    return func.apply(context, arguments);
                };
            };
            var cb = function (value, context, argCount) {
                if (value == null) return _.identity;
                if (_.isFunction(value)) return optimizeCb(value, context, argCount);
                if (_.isObject(value)) return _.matcher(value);
                return _.property(value);
            };
            _.iteratee = function (value, context) {
                return cb(value, context, Infinity);
            };
            var createAssigner = function (keysFunc, undefinedOnly) {
                return function (obj) {
                    var length = arguments.length;
                    if (length < 2 || obj == null) return obj;
                    for (var index = 1; index < length; index++) {
                        var source = arguments[index], keys = keysFunc(source), l = keys.length;
                        for (var i = 0; i < l; i++) {
                            var key = keys[i];
                            if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                        }
                    }
                    return obj;
                };
            };
            var baseCreate = function (prototype) {
                if (!_.isObject(prototype)) return {};
                if (nativeCreate) return nativeCreate(prototype);
                Ctor.prototype = prototype;
                var result = new Ctor();
                Ctor.prototype = null;
                return result;
            };
            var property = function (key) {
                return function (obj) {
                    return obj == null ? void 0 : obj[key];
                };
            };
            var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
            var getLength = property("length");
            var isArrayLike = function (collection) {
                var length = getLength(collection);
                return typeof length == "number" && length >= 0 && length <= MAX_ARRAY_INDEX;
            };
            _.each = _.forEach = function (obj, iteratee, context) {
                iteratee = optimizeCb(iteratee, context);
                var i, length;
                if (isArrayLike(obj)) {
                    for (i = 0, length = obj.length; i < length; i++) {
                        iteratee(obj[i], i, obj);
                    }
                } else {
                    var keys = _.keys(obj);
                    for (i = 0, length = keys.length; i < length; i++) {
                        iteratee(obj[keys[i]], keys[i], obj);
                    }
                }
                return obj;
            };
            _.map = _.collect = function (obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length);
                for (var index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    results[index] = iteratee(obj[currentKey], currentKey, obj);
                }
                return results;
            };
            function createReduce(dir) {
                function iterator(obj, iteratee, memo, keys, index, length) {
                    for (; index >= 0 && index < length; index += dir) {
                        var currentKey = keys ? keys[index] : index;
                        memo = iteratee(memo, obj[currentKey], currentKey, obj);
                    }
                    return memo;
                }
                return function (obj, iteratee, memo, context) {
                    iteratee = optimizeCb(iteratee, context, 4);
                    var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = dir > 0 ? 0 : length - 1;
                    if (arguments.length < 3) {
                        memo = obj[keys ? keys[index] : index];
                        index += dir;
                    }
                    return iterator(obj, iteratee, memo, keys, index, length);
                };
            }
            _.reduce = _.foldl = _.inject = createReduce(1);
            _.reduceRight = _.foldr = createReduce(-1);
            _.find = _.detect = function (obj, predicate, context) {
                var key;
                if (isArrayLike(obj)) {
                    key = _.findIndex(obj, predicate, context);
                } else {
                    key = _.findKey(obj, predicate, context);
                }
                if (key !== void 0 && key !== -1) return obj[key];
            };
            _.filter = _.select = function (obj, predicate, context) {
                var results = [];
                predicate = cb(predicate, context);
                _.each(obj, function (value, index, list) {
                    if (predicate(value, index, list)) results.push(value);
                });
                return results;
            };
            _.reject = function (obj, predicate, context) {
                return _.filter(obj, _.negate(cb(predicate)), context);
            };
            _.every = _.all = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length;
                for (var index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    if (!predicate(obj[currentKey], currentKey, obj)) return false;
                }
                return true;
            };
            _.some = _.any = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length;
                for (var index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    if (predicate(obj[currentKey], currentKey, obj)) return true;
                }
                return false;
            };
            _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
                if (!isArrayLike(obj)) obj = _.values(obj);
                if (typeof fromIndex != "number" || guard) fromIndex = 0;
                return _.indexOf(obj, item, fromIndex) >= 0;
            };
            _.invoke = function (obj, method) {
                var args = slice.call(arguments, 2);
                var isFunc = _.isFunction(method);
                return _.map(obj, function (value) {
                    var func = isFunc ? method : value[method];
                    return func == null ? func : func.apply(value, args);
                });
            };
            _.pluck = function (obj, key) {
                return _.map(obj, _.property(key));
            };
            _.where = function (obj, attrs) {
                return _.filter(obj, _.matcher(attrs));
            };
            _.findWhere = function (obj, attrs) {
                return _.find(obj, _.matcher(attrs));
            };
            _.max = function (obj, iteratee, context) {
                var result = -Infinity, lastComputed = -Infinity, value, computed;
                if (iteratee == null && obj != null) {
                    obj = isArrayLike(obj) ? obj : _.values(obj);
                    for (var i = 0, length = obj.length; i < length; i++) {
                        value = obj[i];
                        if (value > result) {
                            result = value;
                        }
                    }
                } else {
                    iteratee = cb(iteratee, context);
                    _.each(obj, function (value, index, list) {
                        computed = iteratee(value, index, list);
                        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                            result = value;
                            lastComputed = computed;
                        }
                    });
                }
                return result;
            };
            _.min = function (obj, iteratee, context) {
                var result = Infinity, lastComputed = Infinity, value, computed;
                if (iteratee == null && obj != null) {
                    obj = isArrayLike(obj) ? obj : _.values(obj);
                    for (var i = 0, length = obj.length; i < length; i++) {
                        value = obj[i];
                        if (value < result) {
                            result = value;
                        }
                    }
                } else {
                    iteratee = cb(iteratee, context);
                    _.each(obj, function (value, index, list) {
                        computed = iteratee(value, index, list);
                        if (computed < lastComputed || computed === Infinity && result === Infinity) {
                            result = value;
                            lastComputed = computed;
                        }
                    });
                }
                return result;
            };
            _.shuffle = function (obj) {
                var set = isArrayLike(obj) ? obj : _.values(obj);
                var length = set.length;
                var shuffled = Array(length);
                for (var index = 0, rand; index < length; index++) {
                    rand = _.random(0, index);
                    if (rand !== index) shuffled[index] = shuffled[rand];
                    shuffled[rand] = set[index];
                }
                return shuffled;
            };
            _.sample = function (obj, n, guard) {
                if (n == null || guard) {
                    if (!isArrayLike(obj)) obj = _.values(obj);
                    return obj[_.random(obj.length - 1)];
                }
                return _.shuffle(obj).slice(0, Math.max(0, n));
            };
            _.sortBy = function (obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                return _.pluck(_.map(obj, function (value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iteratee(value, index, list)
                    };
                }).sort(function (left, right) {
                    var a = left.criteria;
                    var b = right.criteria;
                    if (a !== b) {
                        if (a > b || a === void 0) return 1;
                        if (a < b || b === void 0) return -1;
                    }
                    return left.index - right.index;
                }), "value");
            };
            var group = function (behavior) {
                return function (obj, iteratee, context) {
                    var result = {};
                    iteratee = cb(iteratee, context);
                    _.each(obj, function (value, index) {
                        var key = iteratee(value, index, obj);
                        behavior(result, value, key);
                    });
                    return result;
                };
            };
            _.groupBy = group(function (result, value, key) {
                if (_.has(result, key)) result[key].push(value); else result[key] = [value];
            });
            _.indexBy = group(function (result, value, key) {
                result[key] = value;
            });
            _.countBy = group(function (result, value, key) {
                if (_.has(result, key)) result[key]++; else result[key] = 1;
            });
            _.toArray = function (obj) {
                if (!obj) return [];
                if (_.isArray(obj)) return slice.call(obj);
                if (isArrayLike(obj)) return _.map(obj, _.identity);
                return _.values(obj);
            };
            _.size = function (obj) {
                if (obj == null) return 0;
                return isArrayLike(obj) ? obj.length : _.keys(obj).length;
            };
            _.partition = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var pass = [], fail = [];
                _.each(obj, function (value, key, obj) {
                    (predicate(value, key, obj) ? pass : fail).push(value);
                });
                return [pass, fail];
            };
            _.first = _.head = _.take = function (array, n, guard) {
                if (array == null) return void 0;
                if (n == null || guard) return array[0];
                return _.initial(array, array.length - n);
            };
            _.initial = function (array, n, guard) {
                return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
            };
            _.last = function (array, n, guard) {
                if (array == null) return void 0;
                if (n == null || guard) return array[array.length - 1];
                return _.rest(array, Math.max(0, array.length - n));
            };
            _.rest = _.tail = _.drop = function (array, n, guard) {
                return slice.call(array, n == null || guard ? 1 : n);
            };
            _.compact = function (array) {
                return _.filter(array, _.identity);
            };
            var flatten = function (input, shallow, strict, startIndex) {
                var output = [], idx = 0;
                for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
                    var value = input[i];
                    if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                        if (!shallow) value = flatten(value, shallow, strict);
                        var j = 0, len = value.length;
                        output.length += len;
                        while (j < len) {
                            output[idx++] = value[j++];
                        }
                    } else if (!strict) {
                        output[idx++] = value;
                    }
                }
                return output;
            };
            _.flatten = function (array, shallow) {
                return flatten(array, shallow, false);
            };
            _.without = function (array) {
                return _.difference(array, slice.call(arguments, 1));
            };
            _.uniq = _.unique = function (array, isSorted, iteratee, context) {
                if (!_.isBoolean(isSorted)) {
                    context = iteratee;
                    iteratee = isSorted;
                    isSorted = false;
                }
                if (iteratee != null) iteratee = cb(iteratee, context);
                var result = [];
                var seen = [];
                for (var i = 0, length = getLength(array); i < length; i++) {
                    var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
                    if (isSorted) {
                        if (!i || seen !== computed) result.push(value);
                        seen = computed;
                    } else if (iteratee) {
                        if (!_.contains(seen, computed)) {
                            seen.push(computed);
                            result.push(value);
                        }
                    } else if (!_.contains(result, value)) {
                        result.push(value);
                    }
                }
                return result;
            };
            _.union = function () {
                return _.uniq(flatten(arguments, true, true));
            };
            _.intersection = function (array) {
                var result = [];
                var argsLength = arguments.length;
                for (var i = 0, length = getLength(array); i < length; i++) {
                    var item = array[i];
                    if (_.contains(result, item)) continue;
                    for (var j = 1; j < argsLength; j++) {
                        if (!_.contains(arguments[j], item)) break;
                    }
                    if (j === argsLength) result.push(item);
                }
                return result;
            };
            _.difference = function (array) {
                var rest = flatten(arguments, true, true, 1);
                return _.filter(array, function (value) {
                    return !_.contains(rest, value);
                });
            };
            _.zip = function () {
                return _.unzip(arguments);
            };
            _.unzip = function (array) {
                var length = array && _.max(array, getLength).length || 0;
                var result = Array(length);
                for (var index = 0; index < length; index++) {
                    result[index] = _.pluck(array, index);
                }
                return result;
            };
            _.object = function (list, values) {
                var result = {};
                for (var i = 0, length = getLength(list); i < length; i++) {
                    if (values) {
                        result[list[i]] = values[i];
                    } else {
                        result[list[i][0]] = list[i][1];
                    }
                }
                return result;
            };
            function createPredicateIndexFinder(dir) {
                return function (array, predicate, context) {
                    predicate = cb(predicate, context);
                    var length = getLength(array);
                    var index = dir > 0 ? 0 : length - 1;
                    for (; index >= 0 && index < length; index += dir) {
                        if (predicate(array[index], index, array)) return index;
                    }
                    return -1;
                };
            }
            _.findIndex = createPredicateIndexFinder(1);
            _.findLastIndex = createPredicateIndexFinder(-1);
            _.sortedIndex = function (array, obj, iteratee, context) {
                iteratee = cb(iteratee, context, 1);
                var value = iteratee(obj);
                var low = 0, high = getLength(array);
                while (low < high) {
                    var mid = Math.floor((low + high) / 2);
                    if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
                }
                return low;
            };
            function createIndexFinder(dir, predicateFind, sortedIndex) {
                return function (array, item, idx) {
                    var i = 0, length = getLength(array);
                    if (typeof idx == "number") {
                        if (dir > 0) {
                            i = idx >= 0 ? idx : Math.max(idx + length, i);
                        } else {
                            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                        }
                    } else if (sortedIndex && idx && length) {
                        idx = sortedIndex(array, item);
                        return array[idx] === item ? idx : -1;
                    }
                    if (item !== item) {
                        idx = predicateFind(slice.call(array, i, length), _.isNaN);
                        return idx >= 0 ? idx + i : -1;
                    }
                    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                        if (array[idx] === item) return idx;
                    }
                    return -1;
                };
            }
            _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
            _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
            _.range = function (start, stop, step) {
                if (stop == null) {
                    stop = start || 0;
                    start = 0;
                }
                step = step || 1;
                var length = Math.max(Math.ceil((stop - start) / step), 0);
                var range = Array(length);
                for (var idx = 0; idx < length; idx++, start += step) {
                    range[idx] = start;
                }
                return range;
            };
            var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
                if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
                var self = baseCreate(sourceFunc.prototype);
                var result = sourceFunc.apply(self, args);
                if (_.isObject(result)) return result;
                return self;
            };
            _.bind = function (func, context) {
                if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func)) throw new TypeError("Bind must be called on a function");
                var args = slice.call(arguments, 2);
                var bound = function () {
                    return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
                };
                return bound;
            };
            _.partial = function (func) {
                var boundArgs = slice.call(arguments, 1);
                var bound = function () {
                    var position = 0, length = boundArgs.length;
                    var args = Array(length);
                    for (var i = 0; i < length; i++) {
                        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
                    }
                    while (position < arguments.length) args.push(arguments[position++]);
                    return executeBound(func, bound, this, this, args);
                };
                return bound;
            };
            _.bindAll = function (obj) {
                var i, length = arguments.length, key;
                if (length <= 1) throw new Error("bindAll must be passed function names");
                for (i = 1; i < length; i++) {
                    key = arguments[i];
                    obj[key] = _.bind(obj[key], obj);
                }
                return obj;
            };
            _.memoize = function (func, hasher) {
                var memoize = function (key) {
                    var cache = memoize.cache;
                    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
                    if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
                    return cache[address];
                };
                memoize.cache = {};
                return memoize;
            };
            _.delay = function (func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function () {
                    return func.apply(null, args);
                }, wait);
            };
            _.defer = _.partial(_.delay, _, 1);
            _.throttle = function (func, wait, options) {
                var context, args, result;
                var timeout = null;
                var previous = 0;
                if (!options) options = {};
                var later = function () {
                    previous = options.leading === false ? 0 : _.now();
                    timeout = null;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                };
                return function () {
                    var now = _.now();
                    if (!previous && options.leading === false) previous = now;
                    var remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0 || remaining > wait) {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                        }
                        previous = now;
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    } else if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            };
            _.debounce = function (func, wait, immediate) {
                var timeout, args, context, timestamp, result;
                var later = function () {
                    var last = _.now() - timestamp;
                    if (last < wait && last >= 0) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                            if (!timeout) context = args = null;
                        }
                    }
                };
                return function () {
                    context = this;
                    args = arguments;
                    timestamp = _.now();
                    var callNow = immediate && !timeout;
                    if (!timeout) timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                        context = args = null;
                    }
                    return result;
                };
            };
            _.wrap = function (func, wrapper) {
                return _.partial(wrapper, func);
            };
            _.negate = function (predicate) {
                return function () {
                    return !predicate.apply(this, arguments);
                };
            };
            _.compose = function () {
                var args = arguments;
                var start = args.length - 1;
                return function () {
                    var i = start;
                    var result = args[start].apply(this, arguments);
                    while (i--) result = args[i].call(this, result);
                    return result;
                };
            };
            _.after = function (times, func) {
                return function () {
                    if (--times < 1) {
                        return func.apply(this, arguments);
                    }
                };
            };
            _.before = function (times, func) {
                var memo;
                return function () {
                    if (--times > 0) {
                        memo = func.apply(this, arguments);
                    }
                    if (times <= 1) func = null;
                    return memo;
                };
            };
            _.once = _.partial(_.before, 2);
            var hasEnumBug = !{
                toString: null
            }.propertyIsEnumerable("toString");
            var nonEnumerableProps = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
            function collectNonEnumProps(obj, keys) {
                var nonEnumIdx = nonEnumerableProps.length;
                var constructor = obj.constructor;
                var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;
                var prop = "constructor";
                if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
                while (nonEnumIdx--) {
                    prop = nonEnumerableProps[nonEnumIdx];
                    if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                        keys.push(prop);
                    }
                }
            }
            _.keys = function (obj) {
                if (!_.isObject(obj)) return [];
                if (nativeKeys) return nativeKeys(obj);
                var keys = [];
                for (var key in obj) if (_.has(obj, key)) keys.push(key);
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
            };
            _.allKeys = function (obj) {
                if (!_.isObject(obj)) return [];
                var keys = [];
                for (var key in obj) keys.push(key);
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
            };
            _.values = function (obj) {
                var keys = _.keys(obj);
                var length = keys.length;
                var values = Array(length);
                for (var i = 0; i < length; i++) {
                    values[i] = obj[keys[i]];
                }
                return values;
            };
            _.mapObject = function (obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                var keys = _.keys(obj), length = keys.length, results = {}, currentKey;
                for (var index = 0; index < length; index++) {
                    currentKey = keys[index];
                    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
                }
                return results;
            };
            _.pairs = function (obj) {
                var keys = _.keys(obj);
                var length = keys.length;
                var pairs = Array(length);
                for (var i = 0; i < length; i++) {
                    pairs[i] = [keys[i], obj[keys[i]]];
                }
                return pairs;
            };
            _.invert = function (obj) {
                var result = {};
                var keys = _.keys(obj);
                for (var i = 0, length = keys.length; i < length; i++) {
                    result[obj[keys[i]]] = keys[i];
                }
                return result;
            };
            _.functions = _.methods = function (obj) {
                var names = [];
                for (var key in obj) {
                    if (_.isFunction(obj[key])) names.push(key);
                }
                return names.sort();
            };
            _.extend = createAssigner(_.allKeys);
            _.extendOwn = _.assign = createAssigner(_.keys);
            _.findKey = function (obj, predicate, context) {
                predicate = cb(predicate, context);
                var keys = _.keys(obj), key;
                for (var i = 0, length = keys.length; i < length; i++) {
                    key = keys[i];
                    if (predicate(obj[key], key, obj)) return key;
                }
            };
            _.pick = function (object, oiteratee, context) {
                var result = {}, obj = object, iteratee, keys;
                if (obj == null) return result;
                if (_.isFunction(oiteratee)) {
                    keys = _.allKeys(obj);
                    iteratee = optimizeCb(oiteratee, context);
                } else {
                    keys = flatten(arguments, false, false, 1);
                    iteratee = function (value, key, obj) {
                        return key in obj;
                    };
                    obj = Object(obj);
                }
                for (var i = 0, length = keys.length; i < length; i++) {
                    var key = keys[i];
                    var value = obj[key];
                    if (iteratee(value, key, obj)) result[key] = value;
                }
                return result;
            };
            _.omit = function (obj, iteratee, context) {
                if (_.isFunction(iteratee)) {
                    iteratee = _.negate(iteratee);
                } else {
                    var keys = _.map(flatten(arguments, false, false, 1), String);
                    iteratee = function (value, key) {
                        return !_.contains(keys, key);
                    };
                }
                return _.pick(obj, iteratee, context);
            };
            _.defaults = createAssigner(_.allKeys, true);
            _.create = function (prototype, props) {
                var result = baseCreate(prototype);
                if (props) _.extendOwn(result, props);
                return result;
            };
            _.clone = function (obj) {
                if (!_.isObject(obj)) return obj;
                return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
            };
            _.tap = function (obj, interceptor) {
                interceptor(obj);
                return obj;
            };
            _.isMatch = function (object, attrs) {
                var keys = _.keys(attrs), length = keys.length;
                if (object == null) return !length;
                var obj = Object(object);
                for (var i = 0; i < length; i++) {
                    var key = keys[i];
                    if (attrs[key] !== obj[key] || !(key in obj)) return false;
                }
                return true;
            };
            var eq = function (a, b, aStack, bStack) {
                if (a === b) return a !== 0 || 1 / a === 1 / b;
                if (a == null || b == null) return a === b;
                if (a instanceof _) a = a._wrapped;
                if (b instanceof _) b = b._wrapped;
                var className = toString.call(a);
                if (className !== toString.call(b)) return false;
                switch (className) {
                    case "[object RegExp]":
                    case "[object String]":
                        return "" + a === "" + b;

                    case "[object Number]":
                        if (+a !== +a) return +b !== +b;
                        return +a === 0 ? 1 / +a === 1 / b : +a === +b;

                    case "[object Date]":
                    case "[object Boolean]":
                        return +a === +b;
                }
                var areArrays = className === "[object Array]";
                if (!areArrays) {
                    if (typeof a != "object" || typeof b != "object") return false;
                    var aCtor = a.constructor, bCtor = b.constructor;
                    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
                        return false;
                    }
                }
                aStack = aStack || [];
                bStack = bStack || [];
                var length = aStack.length;
                while (length--) {
                    if (aStack[length] === a) return bStack[length] === b;
                }
                aStack.push(a);
                bStack.push(b);
                if (areArrays) {
                    length = a.length;
                    if (length !== b.length) return false;
                    while (length--) {
                        if (!eq(a[length], b[length], aStack, bStack)) return false;
                    }
                } else {
                    var keys = _.keys(a), key;
                    length = keys.length;
                    if (_.keys(b).length !== length) return false;
                    while (length--) {
                        key = keys[length];
                        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
                    }
                }
                aStack.pop();
                bStack.pop();
                return true;
            };
            _.isEqual = function (a, b) {
                return eq(a, b);
            };
            _.isEmpty = function (obj) {
                if (obj == null) return true;
                if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
                return _.keys(obj).length === 0;
            };
            _.isElement = function (obj) {
                return !!(obj && obj.nodeType === 1);
            };
            _.isArray = nativeIsArray || function (obj) {
                return toString.call(obj) === "[object Array]";
            };
            _.isObject = function (obj) {
                var type = typeof obj;
                return type === "function" || type === "object" && !!obj;
            };
            _.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (name) {
                _["is" + name] = function (obj) {
                    return toString.call(obj) === "[object " + name + "]";
                };
            });
            if (!_.isArguments(arguments)) {
                _.isArguments = function (obj) {
                    return _.has(obj, "callee");
                };
            }
            if (typeof /./ != "function" && typeof Int8Array != "object") {
                _.isFunction = function (obj) {
                    return typeof obj == "function" || false;
                };
            }
            _.isFinite = function (obj) {
                return isFinite(obj) && !isNaN(parseFloat(obj));
            };
            _.isNaN = function (obj) {
                return _.isNumber(obj) && obj !== +obj;
            };
            _.isBoolean = function (obj) {
                return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
            };
            _.isNull = function (obj) {
                return obj === null;
            };
            _.isUndefined = function (obj) {
                return obj === void 0;
            };
            _.has = function (obj, key) {
                return obj != null && hasOwnProperty.call(obj, key);
            };
            _.noConflict = function () {
                root._ = previousUnderscore;
                return this;
            };
            _.identity = function (value) {
                return value;
            };
            _.constant = function (value) {
                return function () {
                    return value;
                };
            };
            _.noop = function () { };
            _.property = property;
            _.propertyOf = function (obj) {
                return obj == null ? function () { } : function (key) {
                    return obj[key];
                };
            };
            _.matcher = _.matches = function (attrs) {
                attrs = _.extendOwn({}, attrs);
                return function (obj) {
                    return _.isMatch(obj, attrs);
                };
            };
            _.times = function (n, iteratee, context) {
                var accum = Array(Math.max(0, n));
                iteratee = optimizeCb(iteratee, context, 1);
                for (var i = 0; i < n; i++) accum[i] = iteratee(i);
                return accum;
            };
            _.random = function (min, max) {
                if (max == null) {
                    max = min;
                    min = 0;
                }
                return min + Math.floor(Math.random() * (max - min + 1));
            };
            _.now = Date.now || function () {
                return new Date().getTime();
            };
            var escapeMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            };
            var unescapeMap = _.invert(escapeMap);
            var createEscaper = function (map) {
                var escaper = function (match) {
                    return map[match];
                };
                var source = "(?:" + _.keys(map).join("|") + ")";
                var testRegexp = RegExp(source);
                var replaceRegexp = RegExp(source, "g");
                return function (string) {
                    string = string == null ? "" : "" + string;
                    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
                };
            };
            _.escape = createEscaper(escapeMap);
            _.unescape = createEscaper(unescapeMap);
            _.result = function (object, property, fallback) {
                var value = object == null ? void 0 : object[property];
                if (value === void 0) {
                    value = fallback;
                }
                return _.isFunction(value) ? value.call(object) : value;
            };
            var idCounter = 0;
            _.uniqueId = function (prefix) {
                var id = ++idCounter + "";
                return prefix ? prefix + id : id;
            };
            _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/;
            var escapes = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029"
            };
            var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
            var escapeChar = function (match) {
                return "\\" + escapes[match];
            };
            _.template = function (text, settings, oldSettings) {
                if (!settings && oldSettings) settings = oldSettings;
                settings = _.defaults({}, settings, _.templateSettings);
                var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g");
                var index = 0;
                var source = "__p+='";
                text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                    source += text.slice(index, offset).replace(escaper, escapeChar);
                    index = offset + match.length;
                    if (escape) {
                        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
                    } else if (interpolate) {
                        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
                    } else if (evaluate) {
                        source += "';\n" + evaluate + "\n__p+='";
                    }
                    return match;
                });
                source += "';\n";
                if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
                source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                try {
                    var render = new Function(settings.variable || "obj", "_", source);
                } catch (e) {
                    e.source = source;
                    throw e;
                }
                var template = function (data) {
                    return render.call(this, data, _);
                };
                var argument = settings.variable || "obj";
                template.source = "function(" + argument + "){\n" + source + "}";
                return template;
            };
            _.chain = function (obj) {
                var instance = _(obj);
                instance._chain = true;
                return instance;
            };
            var result = function (instance, obj) {
                return instance._chain ? _(obj).chain() : obj;
            };
            _.mixin = function (obj) {
                _.each(_.functions(obj), function (name) {
                    var func = _[name] = obj[name];
                    _.prototype[name] = function () {
                        var args = [this._wrapped];
                        push.apply(args, arguments);
                        return result(this, func.apply(_, args));
                    };
                });
            };
            _.mixin(_);
            _.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (name) {
                var method = ArrayProto[name];
                _.prototype[name] = function () {
                    var obj = this._wrapped;
                    method.apply(obj, arguments);
                    if ((name === "shift" || name === "splice") && obj.length === 0) delete obj[0];
                    return result(this, obj);
                };
            });
            _.each(["concat", "join", "slice"], function (name) {
                var method = ArrayProto[name];
                _.prototype[name] = function () {
                    return result(this, method.apply(this._wrapped, arguments));
                };
            });
            _.prototype.value = function () {
                return this._wrapped;
            };
            _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
            _.prototype.toString = function () {
                return "" + this._wrapped;
            };
            if (typeof define === "function" && define.amd) {
                define("underscore", [], function () {
                    return _;
                });
            }
        }).call(this);
    }, {}],
    3: [function (require, module, exports) {
        (function () {
            window.WebComponents = window.WebComponents || {
                flags: {}
            };
            var file = "webcomponents-lite.js";
            var script = document.querySelector('script[src*="' + file + '"]');
            var flags = {};
            if (!flags.noOpts) {
                location.search.slice(1).split("&").forEach(function (option) {
                    var parts = option.split("=");
                    var match;
                    if (parts[0] && (match = parts[0].match(/wc-(.+)/))) {
                        flags[match[1]] = parts[1] || true;
                    }
                });
                if (script) {
                    for (var i = 0, a; a = script.attributes[i]; i++) {
                        if (a.name !== "src") {
                            flags[a.name] = a.value || true;
                        }
                    }
                }
                if (flags.log && flags.log.split) {
                    var parts = flags.log.split(",");
                    flags.log = {};
                    parts.forEach(function (f) {
                        flags.log[f] = true;
                    });
                } else {
                    flags.log = {};
                }
            }
            if (flags.register) {
                window.CustomElements = window.CustomElements || {
                    flags: {}
                };
                window.CustomElements.flags.register = flags.register;
            }
            WebComponents.flags = flags;
        })();
        (function (scope) {
            "use strict";
            var hasWorkingUrl = false;
            if (!scope.forceJURL) {
                try {
                    var u = new URL("b", "http://a");
                    u.pathname = "c%20d";
                    hasWorkingUrl = u.href === "http://a/c%20d";
                } catch (e) { }
            }
            if (hasWorkingUrl) return;
            var relative = Object.create(null);
            relative["ftp"] = 21;
            relative["file"] = 0;
            relative["gopher"] = 70;
            relative["http"] = 80;
            relative["https"] = 443;
            relative["ws"] = 80;
            relative["wss"] = 443;
            var relativePathDotMapping = Object.create(null);
            relativePathDotMapping["%2e"] = ".";
            relativePathDotMapping[".%2e"] = "..";
            relativePathDotMapping["%2e."] = "..";
            relativePathDotMapping["%2e%2e"] = "..";
            function isRelativeScheme(scheme) {
                return relative[scheme] !== undefined;
            }
            function invalid() {
                clear.call(this);
                this._isInvalid = true;
            }
            function IDNAToASCII(h) {
                if ("" == h) {
                    invalid.call(this);
                }
                return h.toLowerCase();
            }
            function percentEscape(c) {
                var unicode = c.charCodeAt(0);
                if (unicode > 32 && unicode < 127 && [34, 35, 60, 62, 63, 96].indexOf(unicode) == -1) {
                    return c;
                }
                return encodeURIComponent(c);
            }
            function percentEscapeQuery(c) {
                var unicode = c.charCodeAt(0);
                if (unicode > 32 && unicode < 127 && [34, 35, 60, 62, 96].indexOf(unicode) == -1) {
                    return c;
                }
                return encodeURIComponent(c);
            }
            var EOF = undefined, ALPHA = /[a-zA-Z]/, ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;
            function parse(input, stateOverride, base) {
                function err(message) {
                    errors.push(message);
                }
                var state = stateOverride || "scheme start", cursor = 0, buffer = "", seenAt = false, seenBracket = false, errors = [];
                loop: while ((input[cursor - 1] != EOF || cursor == 0) && !this._isInvalid) {
                    var c = input[cursor];
                    switch (state) {
                        case "scheme start":
                            if (c && ALPHA.test(c)) {
                                buffer += c.toLowerCase();
                                state = "scheme";
                            } else if (!stateOverride) {
                                buffer = "";
                                state = "no scheme";
                                continue;
                            } else {
                                err("Invalid scheme.");
                                break loop;
                            }
                            break;

                        case "scheme":
                            if (c && ALPHANUMERIC.test(c)) {
                                buffer += c.toLowerCase();
                            } else if (":" == c) {
                                this._scheme = buffer;
                                buffer = "";
                                if (stateOverride) {
                                    break loop;
                                }
                                if (isRelativeScheme(this._scheme)) {
                                    this._isRelative = true;
                                }
                                if ("file" == this._scheme) {
                                    state = "relative";
                                } else if (this._isRelative && base && base._scheme == this._scheme) {
                                    state = "relative or authority";
                                } else if (this._isRelative) {
                                    state = "authority first slash";
                                } else {
                                    state = "scheme data";
                                }
                            } else if (!stateOverride) {
                                buffer = "";
                                cursor = 0;
                                state = "no scheme";
                                continue;
                            } else if (EOF == c) {
                                break loop;
                            } else {
                                err("Code point not allowed in scheme: " + c);
                                break loop;
                            }
                            break;

                        case "scheme data":
                            if ("?" == c) {
                                this._query = "?";
                                state = "query";
                            } else if ("#" == c) {
                                this._fragment = "#";
                                state = "fragment";
                            } else {
                                if (EOF != c && "\t" != c && "\n" != c && "\r" != c) {
                                    this._schemeData += percentEscape(c);
                                }
                            }
                            break;

                        case "no scheme":
                            if (!base || !isRelativeScheme(base._scheme)) {
                                err("Missing scheme.");
                                invalid.call(this);
                            } else {
                                state = "relative";
                                continue;
                            }
                            break;

                        case "relative or authority":
                            if ("/" == c && "/" == input[cursor + 1]) {
                                state = "authority ignore slashes";
                            } else {
                                err("Expected /, got: " + c);
                                state = "relative";
                                continue;
                            }
                            break;

                        case "relative":
                            this._isRelative = true;
                            if ("file" != this._scheme) this._scheme = base._scheme;
                            if (EOF == c) {
                                this._host = base._host;
                                this._port = base._port;
                                this._path = base._path.slice();
                                this._query = base._query;
                                this._username = base._username;
                                this._password = base._password;
                                break loop;
                            } else if ("/" == c || "\\" == c) {
                                if ("\\" == c) err("\\ is an invalid code point.");
                                state = "relative slash";
                            } else if ("?" == c) {
                                this._host = base._host;
                                this._port = base._port;
                                this._path = base._path.slice();
                                this._query = "?";
                                this._username = base._username;
                                this._password = base._password;
                                state = "query";
                            } else if ("#" == c) {
                                this._host = base._host;
                                this._port = base._port;
                                this._path = base._path.slice();
                                this._query = base._query;
                                this._fragment = "#";
                                this._username = base._username;
                                this._password = base._password;
                                state = "fragment";
                            } else {
                                var nextC = input[cursor + 1];
                                var nextNextC = input[cursor + 2];
                                if ("file" != this._scheme || !ALPHA.test(c) || nextC != ":" && nextC != "|" || EOF != nextNextC && "/" != nextNextC && "\\" != nextNextC && "?" != nextNextC && "#" != nextNextC) {
                                    this._host = base._host;
                                    this._port = base._port;
                                    this._username = base._username;
                                    this._password = base._password;
                                    this._path = base._path.slice();
                                    this._path.pop();
                                }
                                state = "relative path";
                                continue;
                            }
                            break;

                        case "relative slash":
                            if ("/" == c || "\\" == c) {
                                if ("\\" == c) {
                                    err("\\ is an invalid code point.");
                                }
                                if ("file" == this._scheme) {
                                    state = "file host";
                                } else {
                                    state = "authority ignore slashes";
                                }
                            } else {
                                if ("file" != this._scheme) {
                                    this._host = base._host;
                                    this._port = base._port;
                                    this._username = base._username;
                                    this._password = base._password;
                                }
                                state = "relative path";
                                continue;
                            }
                            break;

                        case "authority first slash":
                            if ("/" == c) {
                                state = "authority second slash";
                            } else {
                                err("Expected '/', got: " + c);
                                state = "authority ignore slashes";
                                continue;
                            }
                            break;

                        case "authority second slash":
                            state = "authority ignore slashes";
                            if ("/" != c) {
                                err("Expected '/', got: " + c);
                                continue;
                            }
                            break;

                        case "authority ignore slashes":
                            if ("/" != c && "\\" != c) {
                                state = "authority";
                                continue;
                            } else {
                                err("Expected authority, got: " + c);
                            }
                            break;

                        case "authority":
                            if ("@" == c) {
                                if (seenAt) {
                                    err("@ already seen.");
                                    buffer += "%40";
                                }
                                seenAt = true;
                                for (var i = 0; i < buffer.length; i++) {
                                    var cp = buffer[i];
                                    if ("\t" == cp || "\n" == cp || "\r" == cp) {
                                        err("Invalid whitespace in authority.");
                                        continue;
                                    }
                                    if (":" == cp && null === this._password) {
                                        this._password = "";
                                        continue;
                                    }
                                    var tempC = percentEscape(cp);
                                    null !== this._password ? this._password += tempC : this._username += tempC;
                                }
                                buffer = "";
                            } else if (EOF == c || "/" == c || "\\" == c || "?" == c || "#" == c) {
                                cursor -= buffer.length;
                                buffer = "";
                                state = "host";
                                continue;
                            } else {
                                buffer += c;
                            }
                            break;

                        case "file host":
                            if (EOF == c || "/" == c || "\\" == c || "?" == c || "#" == c) {
                                if (buffer.length == 2 && ALPHA.test(buffer[0]) && (buffer[1] == ":" || buffer[1] == "|")) {
                                    state = "relative path";
                                } else if (buffer.length == 0) {
                                    state = "relative path start";
                                } else {
                                    this._host = IDNAToASCII.call(this, buffer);
                                    buffer = "";
                                    state = "relative path start";
                                }
                                continue;
                            } else if ("\t" == c || "\n" == c || "\r" == c) {
                                err("Invalid whitespace in file host.");
                            } else {
                                buffer += c;
                            }
                            break;

                        case "host":
                        case "hostname":
                            if (":" == c && !seenBracket) {
                                this._host = IDNAToASCII.call(this, buffer);
                                buffer = "";
                                state = "port";
                                if ("hostname" == stateOverride) {
                                    break loop;
                                }
                            } else if (EOF == c || "/" == c || "\\" == c || "?" == c || "#" == c) {
                                this._host = IDNAToASCII.call(this, buffer);
                                buffer = "";
                                state = "relative path start";
                                if (stateOverride) {
                                    break loop;
                                }
                                continue;
                            } else if ("\t" != c && "\n" != c && "\r" != c) {
                                if ("[" == c) {
                                    seenBracket = true;
                                } else if ("]" == c) {
                                    seenBracket = false;
                                }
                                buffer += c;
                            } else {
                                err("Invalid code point in host/hostname: " + c);
                            }
                            break;

                        case "port":
                            if (/[0-9]/.test(c)) {
                                buffer += c;
                            } else if (EOF == c || "/" == c || "\\" == c || "?" == c || "#" == c || stateOverride) {
                                if ("" != buffer) {
                                    var temp = parseInt(buffer, 10);
                                    if (temp != relative[this._scheme]) {
                                        this._port = temp + "";
                                    }
                                    buffer = "";
                                }
                                if (stateOverride) {
                                    break loop;
                                }
                                state = "relative path start";
                                continue;
                            } else if ("\t" == c || "\n" == c || "\r" == c) {
                                err("Invalid code point in port: " + c);
                            } else {
                                invalid.call(this);
                            }
                            break;

                        case "relative path start":
                            if ("\\" == c) err("'\\' not allowed in path.");
                            state = "relative path";
                            if ("/" != c && "\\" != c) {
                                continue;
                            }
                            break;

                        case "relative path":
                            if (EOF == c || "/" == c || "\\" == c || !stateOverride && ("?" == c || "#" == c)) {
                                if ("\\" == c) {
                                    err("\\ not allowed in relative path.");
                                }
                                var tmp;
                                if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
                                    buffer = tmp;
                                }
                                if (".." == buffer) {
                                    this._path.pop();
                                    if ("/" != c && "\\" != c) {
                                        this._path.push("");
                                    }
                                } else if ("." == buffer && "/" != c && "\\" != c) {
                                    this._path.push("");
                                } else if ("." != buffer) {
                                    if ("file" == this._scheme && this._path.length == 0 && buffer.length == 2 && ALPHA.test(buffer[0]) && buffer[1] == "|") {
                                        buffer = buffer[0] + ":";
                                    }
                                    this._path.push(buffer);
                                }
                                buffer = "";
                                if ("?" == c) {
                                    this._query = "?";
                                    state = "query";
                                } else if ("#" == c) {
                                    this._fragment = "#";
                                    state = "fragment";
                                }
                            } else if ("\t" != c && "\n" != c && "\r" != c) {
                                buffer += percentEscape(c);
                            }
                            break;

                        case "query":
                            if (!stateOverride && "#" == c) {
                                this._fragment = "#";
                                state = "fragment";
                            } else if (EOF != c && "\t" != c && "\n" != c && "\r" != c) {
                                this._query += percentEscapeQuery(c);
                            }
                            break;

                        case "fragment":
                            if (EOF != c && "\t" != c && "\n" != c && "\r" != c) {
                                this._fragment += c;
                            }
                            break;
                    }
                    cursor++;
                }
            }
            function clear() {
                this._scheme = "";
                this._schemeData = "";
                this._username = "";
                this._password = null;
                this._host = "";
                this._port = "";
                this._path = [];
                this._query = "";
                this._fragment = "";
                this._isInvalid = false;
                this._isRelative = false;
            }
            function jURL(url, base) {
                if (base !== undefined && !(base instanceof jURL)) base = new jURL(String(base));
                this._url = url;
                clear.call(this);
                var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
                parse.call(this, input, null, base);
            }
            jURL.prototype = {
                toString: function () {
                    return this.href;
                },
                get href() {
                    if (this._isInvalid) return this._url;
                    var authority = "";
                    if ("" != this._username || null != this._password) {
                        authority = this._username + (null != this._password ? ":" + this._password : "") + "@";
                    }
                    return this.protocol + (this._isRelative ? "//" + authority + this.host : "") + this.pathname + this._query + this._fragment;
                },
                set href(href) {
                    clear.call(this);
                    parse.call(this, href);
                },
                get protocol() {
                    return this._scheme + ":";
                },
                set protocol(protocol) {
                    if (this._isInvalid) return;
                    parse.call(this, protocol + ":", "scheme start");
                },
                get host() {
                    return this._isInvalid ? "" : this._port ? this._host + ":" + this._port : this._host;
                },
                set host(host) {
                    if (this._isInvalid || !this._isRelative) return;
                    parse.call(this, host, "host");
                },
                get hostname() {
                    return this._host;
                },
                set hostname(hostname) {
                    if (this._isInvalid || !this._isRelative) return;
                    parse.call(this, hostname, "hostname");
                },
                get port() {
                    return this._port;
                },
                set port(port) {
                    if (this._isInvalid || !this._isRelative) return;
                    parse.call(this, port, "port");
                },
                get pathname() {
                    return this._isInvalid ? "" : this._isRelative ? "/" + this._path.join("/") : this._schemeData;
                },
                set pathname(pathname) {
                    if (this._isInvalid || !this._isRelative) return;
                    this._path = [];
                    parse.call(this, pathname, "relative path start");
                },
                get search() {
                    return this._isInvalid || !this._query || "?" == this._query ? "" : this._query;
                },
                set search(search) {
                    if (this._isInvalid || !this._isRelative) return;
                    this._query = "?";
                    if ("?" == search[0]) search = search.slice(1);
                    parse.call(this, search, "query");
                },
                get hash() {
                    return this._isInvalid || !this._fragment || "#" == this._fragment ? "" : this._fragment;
                },
                set hash(hash) {
                    if (this._isInvalid) return;
                    this._fragment = "#";
                    if ("#" == hash[0]) hash = hash.slice(1);
                    parse.call(this, hash, "fragment");
                },
                get origin() {
                    var host;
                    if (this._isInvalid || !this._scheme) {
                        return "";
                    }
                    switch (this._scheme) {
                        case "data":
                        case "file":
                        case "javascript":
                        case "mailto":
                            return "null";
                    }
                    host = this.host;
                    if (!host) {
                        return "";
                    }
                    return this._scheme + "://" + host;
                }
            };
            var OriginalURL = scope.URL;
            if (OriginalURL) {
                jURL.createObjectURL = function (blob) {
                    return OriginalURL.createObjectURL.apply(OriginalURL, arguments);
                };
                jURL.revokeObjectURL = function (url) {
                    OriginalURL.revokeObjectURL(url);
                };
            }
            scope.URL = jURL;
        })(self);
        if (typeof WeakMap === "undefined") {
            (function () {
                var defineProperty = Object.defineProperty;
                var counter = Date.now() % 1e9;
                var WeakMap = function () {
                    this.name = "__st" + (Math.random() * 1e9 >>> 0) + (counter++ + "__");
                };
                WeakMap.prototype = {
                    set: function (key, value) {
                        var entry = key[this.name];
                        if (entry && entry[0] === key) entry[1] = value; else defineProperty(key, this.name, {
                            value: [key, value],
                            writable: true
                        });
                        return this;
                    },
                    get: function (key) {
                        var entry;
                        return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined;
                    },
                    delete: function (key) {
                        var entry = key[this.name];
                        if (!entry || entry[0] !== key) return false;
                        entry[0] = entry[1] = undefined;
                        return true;
                    },
                    has: function (key) {
                        var entry = key[this.name];
                        if (!entry) return false;
                        return entry[0] === key;
                    }
                };
                window.WeakMap = WeakMap;
            })();
        }
        (function (global) {
            if (global.JsMutationObserver) {
                return;
            }
            var registrationsTable = new WeakMap();
            var setImmediate;
            if (/Trident|Edge/.test(navigator.userAgent)) {
                setImmediate = setTimeout;
            } else if (window.setImmediate) {
                setImmediate = window.setImmediate;
            } else {
                var setImmediateQueue = [];
                var sentinel = String(Math.random());
                window.addEventListener("message", function (e) {
                    if (e.data === sentinel) {
                        var queue = setImmediateQueue;
                        setImmediateQueue = [];
                        queue.forEach(function (func) {
                            func();
                        });
                    }
                });
                setImmediate = function (func) {
                    setImmediateQueue.push(func);
                    window.postMessage(sentinel, "*");
                };
            }
            var isScheduled = false;
            var scheduledObservers = [];
            function scheduleCallback(observer) {
                scheduledObservers.push(observer);
                if (!isScheduled) {
                    isScheduled = true;
                    setImmediate(dispatchCallbacks);
                }
            }
            function wrapIfNeeded(node) {
                return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(node) || node;
            }
            function dispatchCallbacks() {
                isScheduled = false;
                var observers = scheduledObservers;
                scheduledObservers = [];
                observers.sort(function (o1, o2) {
                    return o1.uid_ - o2.uid_;
                });
                var anyNonEmpty = false;
                observers.forEach(function (observer) {
                    var queue = observer.takeRecords();
                    removeTransientObserversFor(observer);
                    if (queue.length) {
                        observer.callback_(queue, observer);
                        anyNonEmpty = true;
                    }
                });
                if (anyNonEmpty) dispatchCallbacks();
            }
            function removeTransientObserversFor(observer) {
                observer.nodes_.forEach(function (node) {
                    var registrations = registrationsTable.get(node);
                    if (!registrations) return;
                    registrations.forEach(function (registration) {
                        if (registration.observer === observer) registration.removeTransientObservers();
                    });
                });
            }
            function forEachAncestorAndObserverEnqueueRecord(target, callback) {
                for (var node = target; node; node = node.parentNode) {
                    var registrations = registrationsTable.get(node);
                    if (registrations) {
                        for (var j = 0; j < registrations.length; j++) {
                            var registration = registrations[j];
                            var options = registration.options;
                            if (node !== target && !options.subtree) continue;
                            var record = callback(options);
                            if (record) registration.enqueue(record);
                        }
                    }
                }
            }
            var uidCounter = 0;
            function JsMutationObserver(callback) {
                this.callback_ = callback;
                this.nodes_ = [];
                this.records_ = [];
                this.uid_ = ++uidCounter;
            }
            JsMutationObserver.prototype = {
                observe: function (target, options) {
                    target = wrapIfNeeded(target);
                    if (!options.childList && !options.attributes && !options.characterData || options.attributeOldValue && !options.attributes || options.attributeFilter && options.attributeFilter.length && !options.attributes || options.characterDataOldValue && !options.characterData) {
                        throw new SyntaxError();
                    }
                    var registrations = registrationsTable.get(target);
                    if (!registrations) registrationsTable.set(target, registrations = []);
                    var registration;
                    for (var i = 0; i < registrations.length; i++) {
                        if (registrations[i].observer === this) {
                            registration = registrations[i];
                            registration.removeListeners();
                            registration.options = options;
                            break;
                        }
                    }
                    if (!registration) {
                        registration = new Registration(this, target, options);
                        registrations.push(registration);
                        this.nodes_.push(target);
                    }
                    registration.addListeners();
                },
                disconnect: function () {
                    this.nodes_.forEach(function (node) {
                        var registrations = registrationsTable.get(node);
                        for (var i = 0; i < registrations.length; i++) {
                            var registration = registrations[i];
                            if (registration.observer === this) {
                                registration.removeListeners();
                                registrations.splice(i, 1);
                                break;
                            }
                        }
                    }, this);
                    this.records_ = [];
                },
                takeRecords: function () {
                    var copyOfRecords = this.records_;
                    this.records_ = [];
                    return copyOfRecords;
                }
            };
            function MutationRecord(type, target) {
                this.type = type;
                this.target = target;
                this.addedNodes = [];
                this.removedNodes = [];
                this.previousSibling = null;
                this.nextSibling = null;
                this.attributeName = null;
                this.attributeNamespace = null;
                this.oldValue = null;
            }
            function copyMutationRecord(original) {
                var record = new MutationRecord(original.type, original.target);
                record.addedNodes = original.addedNodes.slice();
                record.removedNodes = original.removedNodes.slice();
                record.previousSibling = original.previousSibling;
                record.nextSibling = original.nextSibling;
                record.attributeName = original.attributeName;
                record.attributeNamespace = original.attributeNamespace;
                record.oldValue = original.oldValue;
                return record;
            }
            var currentRecord, recordWithOldValue;
            function getRecord(type, target) {
                return currentRecord = new MutationRecord(type, target);
            }
            function getRecordWithOldValue(oldValue) {
                if (recordWithOldValue) return recordWithOldValue;
                recordWithOldValue = copyMutationRecord(currentRecord);
                recordWithOldValue.oldValue = oldValue;
                return recordWithOldValue;
            }
            function clearRecords() {
                currentRecord = recordWithOldValue = undefined;
            }
            function recordRepresentsCurrentMutation(record) {
                return record === recordWithOldValue || record === currentRecord;
            }
            function selectRecord(lastRecord, newRecord) {
                if (lastRecord === newRecord) return lastRecord;
                if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord)) return recordWithOldValue;
                return null;
            }
            function Registration(observer, target, options) {
                this.observer = observer;
                this.target = target;
                this.options = options;
                this.transientObservedNodes = [];
            }
            Registration.prototype = {
                enqueue: function (record) {
                    var records = this.observer.records_;
                    var length = records.length;
                    if (records.length > 0) {
                        var lastRecord = records[length - 1];
                        var recordToReplaceLast = selectRecord(lastRecord, record);
                        if (recordToReplaceLast) {
                            records[length - 1] = recordToReplaceLast;
                            return;
                        }
                    } else {
                        scheduleCallback(this.observer);
                    }
                    records[length] = record;
                },
                addListeners: function () {
                    this.addListeners_(this.target);
                },
                addListeners_: function (node) {
                    var options = this.options;
                    if (options.attributes) node.addEventListener("DOMAttrModified", this, true);
                    if (options.characterData) node.addEventListener("DOMCharacterDataModified", this, true);
                    if (options.childList) node.addEventListener("DOMNodeInserted", this, true);
                    if (options.childList || options.subtree) node.addEventListener("DOMNodeRemoved", this, true);
                },
                removeListeners: function () {
                    this.removeListeners_(this.target);
                },
                removeListeners_: function (node) {
                    var options = this.options;
                    if (options.attributes) node.removeEventListener("DOMAttrModified", this, true);
                    if (options.characterData) node.removeEventListener("DOMCharacterDataModified", this, true);
                    if (options.childList) node.removeEventListener("DOMNodeInserted", this, true);
                    if (options.childList || options.subtree) node.removeEventListener("DOMNodeRemoved", this, true);
                },
                addTransientObserver: function (node) {
                    if (node === this.target) return;
                    this.addListeners_(node);
                    this.transientObservedNodes.push(node);
                    var registrations = registrationsTable.get(node);
                    if (!registrations) registrationsTable.set(node, registrations = []);
                    registrations.push(this);
                },
                removeTransientObservers: function () {
                    var transientObservedNodes = this.transientObservedNodes;
                    this.transientObservedNodes = [];
                    transientObservedNodes.forEach(function (node) {
                        this.removeListeners_(node);
                        var registrations = registrationsTable.get(node);
                        for (var i = 0; i < registrations.length; i++) {
                            if (registrations[i] === this) {
                                registrations.splice(i, 1);
                                break;
                            }
                        }
                    }, this);
                },
                handleEvent: function (e) {
                    e.stopImmediatePropagation();
                    switch (e.type) {
                        case "DOMAttrModified":
                            var name = e.attrName;
                            var namespace = e.relatedNode.namespaceURI;
                            var target = e.target;
                            var record = new getRecord("attributes", target);
                            record.attributeName = name;
                            record.attributeNamespace = namespace;
                            var oldValue = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                            forEachAncestorAndObserverEnqueueRecord(target, function (options) {
                                if (!options.attributes) return;
                                if (options.attributeFilter && options.attributeFilter.length && options.attributeFilter.indexOf(name) === -1 && options.attributeFilter.indexOf(namespace) === -1) {
                                    return;
                                }
                                if (options.attributeOldValue) return getRecordWithOldValue(oldValue);
                                return record;
                            });
                            break;

                        case "DOMCharacterDataModified":
                            var target = e.target;
                            var record = getRecord("characterData", target);
                            var oldValue = e.prevValue;
                            forEachAncestorAndObserverEnqueueRecord(target, function (options) {
                                if (!options.characterData) return;
                                if (options.characterDataOldValue) return getRecordWithOldValue(oldValue);
                                return record;
                            });
                            break;

                        case "DOMNodeRemoved":
                            this.addTransientObserver(e.target);

                        case "DOMNodeInserted":
                            var changedNode = e.target;
                            var addedNodes, removedNodes;
                            if (e.type === "DOMNodeInserted") {
                                addedNodes = [changedNode];
                                removedNodes = [];
                            } else {
                                addedNodes = [];
                                removedNodes = [changedNode];
                            }
                            var previousSibling = changedNode.previousSibling;
                            var nextSibling = changedNode.nextSibling;
                            var record = getRecord("childList", e.target.parentNode);
                            record.addedNodes = addedNodes;
                            record.removedNodes = removedNodes;
                            record.previousSibling = previousSibling;
                            record.nextSibling = nextSibling;
                            forEachAncestorAndObserverEnqueueRecord(e.relatedNode, function (options) {
                                if (!options.childList) return;
                                return record;
                            });
                    }
                    clearRecords();
                }
            };
            global.JsMutationObserver = JsMutationObserver;
            if (!global.MutationObserver) {
                global.MutationObserver = JsMutationObserver;
                JsMutationObserver._isPolyfilled = true;
            }
        })(self);
        (function () {
            var needsTemplate = typeof HTMLTemplateElement === "undefined";
            if (/Trident/.test(navigator.userAgent)) {
                (function () {
                    var importNode = document.importNode;
                    document.importNode = function () {
                        var n = importNode.apply(document, arguments);
                        if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                            var f = document.createDocumentFragment();
                            f.appendChild(n);
                            return f;
                        } else {
                            return n;
                        }
                    };
                })();
            }
            var needsCloning = function () {
                if (!needsTemplate) {
                    var t = document.createElement("template");
                    var t2 = document.createElement("template");
                    t2.content.appendChild(document.createElement("div"));
                    t.content.appendChild(t2);
                    var clone = t.cloneNode(true);
                    return clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0;
                }
            }();
            var TEMPLATE_TAG = "template";
            var TemplateImpl = function () { };
            if (needsTemplate) {
                var contentDoc = document.implementation.createHTMLDocument("template");
                var canDecorate = true;
                var templateStyle = document.createElement("style");
                templateStyle.textContent = TEMPLATE_TAG + "{display:none;}";
                var head = document.head;
                head.insertBefore(templateStyle, head.firstElementChild);
                TemplateImpl.prototype = Object.create(HTMLElement.prototype);
                TemplateImpl.decorate = function (template) {
                    if (template.content) {
                        return;
                    }
                    template.content = contentDoc.createDocumentFragment();
                    var child;
                    while (child = template.firstChild) {
                        template.content.appendChild(child);
                    }
                    template.cloneNode = function (deep) {
                        return TemplateImpl.cloneNode(this, deep);
                    };
                    if (canDecorate) {
                        try {
                            Object.defineProperty(template, "innerHTML", {
                                get: function () {
                                    var o = "";
                                    for (var e = this.content.firstChild; e; e = e.nextSibling) {
                                        o += e.outerHTML || escapeData(e.data);
                                    }
                                    return o;
                                },
                                set: function (text) {
                                    contentDoc.body.innerHTML = text;
                                    TemplateImpl.bootstrap(contentDoc);
                                    while (this.content.firstChild) {
                                        this.content.removeChild(this.content.firstChild);
                                    }
                                    while (contentDoc.body.firstChild) {
                                        this.content.appendChild(contentDoc.body.firstChild);
                                    }
                                },
                                configurable: true
                            });
                        } catch (err) {
                            canDecorate = false;
                        }
                    }
                    TemplateImpl.bootstrap(template.content);
                };
                TemplateImpl.bootstrap = function (doc) {
                    var templates = doc.querySelectorAll(TEMPLATE_TAG);
                    for (var i = 0, l = templates.length, t; i < l && (t = templates[i]); i++) {
                        TemplateImpl.decorate(t);
                    }
                };
                document.addEventListener("DOMContentLoaded", function () {
                    TemplateImpl.bootstrap(document);
                });
                var createElement = document.createElement;
                document.createElement = function () {
                    "use strict";
                    var el = createElement.apply(document, arguments);
                    if (el.localName === "template") {
                        TemplateImpl.decorate(el);
                    }
                    return el;
                };
                var escapeDataRegExp = /[&\u00A0<>]/g;
                function escapeReplace(c) {
                    switch (c) {
                        case "&":
                            return "&amp;";

                        case "<":
                            return "&lt;";

                        case ">":
                            return "&gt;";

                        case " ":
                            return "&nbsp;";
                    }
                }
                function escapeData(s) {
                    return s.replace(escapeDataRegExp, escapeReplace);
                }
            }
            if (needsTemplate || needsCloning) {
                var nativeCloneNode = Node.prototype.cloneNode;
                TemplateImpl.cloneNode = function (template, deep) {
                    var clone = nativeCloneNode.call(template, false);
                    if (this.decorate) {
                        this.decorate(clone);
                    }
                    if (deep) {
                        clone.content.appendChild(nativeCloneNode.call(template.content, true));
                        this.fixClonedDom(clone.content, template.content);
                    }
                    return clone;
                };
                TemplateImpl.fixClonedDom = function (clone, source) {
                    if (!source.querySelectorAll) return;
                    var s$ = source.querySelectorAll(TEMPLATE_TAG);
                    var t$ = clone.querySelectorAll(TEMPLATE_TAG);
                    for (var i = 0, l = t$.length, t, s; i < l; i++) {
                        s = s$[i];
                        t = t$[i];
                        if (this.decorate) {
                            this.decorate(s);
                        }
                        t.parentNode.replaceChild(s.cloneNode(true), t);
                    }
                };
                var originalImportNode = document.importNode;
                Node.prototype.cloneNode = function (deep) {
                    var dom = nativeCloneNode.call(this, deep);
                    if (deep) {
                        TemplateImpl.fixClonedDom(dom, this);
                    }
                    return dom;
                };
                document.importNode = function (element, deep) {
                    if (element.localName === TEMPLATE_TAG) {
                        return TemplateImpl.cloneNode(element, deep);
                    } else {
                        var dom = originalImportNode.call(document, element, deep);
                        if (deep) {
                            TemplateImpl.fixClonedDom(dom, element);
                        }
                        return dom;
                    }
                };
                if (needsCloning) {
                    HTMLTemplateElement.prototype.cloneNode = function (deep) {
                        return TemplateImpl.cloneNode(this, deep);
                    };
                }
            }
            if (needsTemplate) {
                window.HTMLTemplateElement = TemplateImpl;
            }
        })();
        (function (scope) {
            "use strict";
            if (!(window.performance && window.performance.now)) {
                var start = Date.now();
                window.performance = {
                    now: function () {
                        return Date.now() - start;
                    }
                };
            }
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function () {
                    var nativeRaf = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
                    return nativeRaf ? function (callback) {
                        return nativeRaf(function () {
                            callback(performance.now());
                        });
                    } : function (callback) {
                        return window.setTimeout(callback, 1e3 / 60);
                    };
                }();
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function () {
                    return window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (id) {
                        clearTimeout(id);
                    };
                }();
            }
            var workingDefaultPrevented = function () {
                var e = document.createEvent("Event");
                e.initEvent("foo", true, true);
                e.preventDefault();
                return e.defaultPrevented;
            }();
            if (!workingDefaultPrevented) {
                var origPreventDefault = Event.prototype.preventDefault;
                Event.prototype.preventDefault = function () {
                    if (!this.cancelable) {
                        return;
                    }
                    origPreventDefault.call(this);
                    Object.defineProperty(this, "defaultPrevented", {
                        get: function () {
                            return true;
                        },
                        configurable: true
                    });
                };
            }
            var isIE = /Trident/.test(navigator.userAgent);
            if (!window.CustomEvent || isIE && typeof window.CustomEvent !== "function") {
                window.CustomEvent = function (inType, params) {
                    params = params || {};
                    var e = document.createEvent("CustomEvent");
                    e.initCustomEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
                    return e;
                };
                window.CustomEvent.prototype = window.Event.prototype;
            }
            if (!window.Event || isIE && typeof window.Event !== "function") {
                var origEvent = window.Event;
                window.Event = function (inType, params) {
                    params = params || {};
                    var e = document.createEvent("Event");
                    e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
                    return e;
                };
                window.Event.prototype = origEvent.prototype;
            }
        })(window.WebComponents);
        window.HTMLImports = window.HTMLImports || {
            flags: {}
        };
        (function (scope) {
            var IMPORT_LINK_TYPE = "import";
            var useNative = Boolean(IMPORT_LINK_TYPE in document.createElement("link"));
            var hasShadowDOMPolyfill = Boolean(window.ShadowDOMPolyfill);
            var wrap = function (node) {
                return hasShadowDOMPolyfill ? window.ShadowDOMPolyfill.wrapIfNeeded(node) : node;
            };
            var rootDocument = wrap(document);
            var currentScriptDescriptor = {
                get: function () {
                    var script = window.HTMLImports.currentScript || document.currentScript || (document.readyState !== "complete" ? document.scripts[document.scripts.length - 1] : null);
                    return wrap(script);
                },
                configurable: true
            };
            Object.defineProperty(document, "_currentScript", currentScriptDescriptor);
            Object.defineProperty(rootDocument, "_currentScript", currentScriptDescriptor);
            var isIE = /Trident/.test(navigator.userAgent);
            function whenReady(callback, doc) {
                doc = doc || rootDocument;
                whenDocumentReady(function () {
                    watchImportsLoad(callback, doc);
                }, doc);
            }
            var requiredReadyState = isIE ? "complete" : "interactive";
            var READY_EVENT = "readystatechange";
            function isDocumentReady(doc) {
                return doc.readyState === "complete" || doc.readyState === requiredReadyState;
            }
            function whenDocumentReady(callback, doc) {
                if (!isDocumentReady(doc)) {
                    var checkReady = function () {
                        if (doc.readyState === "complete" || doc.readyState === requiredReadyState) {
                            doc.removeEventListener(READY_EVENT, checkReady);
                            whenDocumentReady(callback, doc);
                        }
                    };
                    doc.addEventListener(READY_EVENT, checkReady);
                } else if (callback) {
                    callback();
                }
            }
            function markTargetLoaded(event) {
                event.target.__loaded = true;
            }
            function watchImportsLoad(callback, doc) {
                var imports = doc.querySelectorAll("link[rel=import]");
                var parsedCount = 0, importCount = imports.length, newImports = [], errorImports = [];
                function checkDone() {
                    if (parsedCount == importCount && callback) {
                        callback({
                            allImports: imports,
                            loadedImports: newImports,
                            errorImports: errorImports
                        });
                    }
                }
                function loadedImport(e) {
                    markTargetLoaded(e);
                    newImports.push(this);
                    parsedCount++;
                    checkDone();
                }
                function errorLoadingImport(e) {
                    errorImports.push(this);
                    parsedCount++;
                    checkDone();
                }
                if (importCount) {
                    for (var i = 0, imp; i < importCount && (imp = imports[i]); i++) {
                        if (isImportLoaded(imp)) {
                            newImports.push(this);
                            parsedCount++;
                            checkDone();
                        } else {
                            imp.addEventListener("load", loadedImport);
                            imp.addEventListener("error", errorLoadingImport);
                        }
                    }
                } else {
                    checkDone();
                }
            }
            function isImportLoaded(link) {
                return useNative ? link.__loaded || link.import && link.import.readyState !== "loading" : link.__importParsed;
            }
            if (useNative) {
                new MutationObserver(function (mxns) {
                    for (var i = 0, l = mxns.length, m; i < l && (m = mxns[i]); i++) {
                        if (m.addedNodes) {
                            handleImports(m.addedNodes);
                        }
                    }
                }).observe(document.head, {
                    childList: true
                });
                function handleImports(nodes) {
                    for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
                        if (isImport(n)) {
                            handleImport(n);
                        }
                    }
                }
                function isImport(element) {
                    return element.localName === "link" && element.rel === "import";
                }
                function handleImport(element) {
                    var loaded = element.import;
                    if (loaded) {
                        markTargetLoaded({
                            target: element
                        });
                    } else {
                        element.addEventListener("load", markTargetLoaded);
                        element.addEventListener("error", markTargetLoaded);
                    }
                }
                (function () {
                    if (document.readyState === "loading") {
                        var imports = document.querySelectorAll("link[rel=import]");
                        for (var i = 0, l = imports.length, imp; i < l && (imp = imports[i]); i++) {
                            handleImport(imp);
                        }
                    }
                })();
            }
            whenReady(function (detail) {
                window.HTMLImports.ready = true;
                window.HTMLImports.readyTime = new Date().getTime();
                var evt = rootDocument.createEvent("CustomEvent");
                evt.initCustomEvent("HTMLImportsLoaded", true, true, detail);
                rootDocument.dispatchEvent(evt);
            });
            scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
            scope.useNative = useNative;
            scope.rootDocument = rootDocument;
            scope.whenReady = whenReady;
            scope.isIE = isIE;
        })(window.HTMLImports);
        (function (scope) {
            var modules = [];
            var addModule = function (module) {
                modules.push(module);
            };
            var initializeModules = function () {
                modules.forEach(function (module) {
                    module(scope);
                });
            };
            scope.addModule = addModule;
            scope.initializeModules = initializeModules;
        })(window.HTMLImports);
        window.HTMLImports.addModule(function (scope) {
            var CSS_URL_REGEXP = /(url\()([^)]*)(\))/g;
            var CSS_IMPORT_REGEXP = /(@import[\s]+(?!url\())([^;]*)(;)/g;
            var path = {
                resolveUrlsInStyle: function (style, linkUrl) {
                    var doc = style.ownerDocument;
                    var resolver = doc.createElement("a");
                    style.textContent = this.resolveUrlsInCssText(style.textContent, linkUrl, resolver);
                    return style;
                },
                resolveUrlsInCssText: function (cssText, linkUrl, urlObj) {
                    var r = this.replaceUrls(cssText, urlObj, linkUrl, CSS_URL_REGEXP);
                    r = this.replaceUrls(r, urlObj, linkUrl, CSS_IMPORT_REGEXP);
                    return r;
                },
                replaceUrls: function (text, urlObj, linkUrl, regexp) {
                    return text.replace(regexp, function (m, pre, url, post) {
                        var urlPath = url.replace(/["']/g, "");
                        if (linkUrl) {
                            urlPath = new URL(urlPath, linkUrl).href;
                        }
                        urlObj.href = urlPath;
                        urlPath = urlObj.href;
                        return pre + "'" + urlPath + "'" + post;
                    });
                }
            };
            scope.path = path;
        });
        window.HTMLImports.addModule(function (scope) {
            var xhr = {
                async: true,
                ok: function (request) {
                    return request.status >= 200 && request.status < 300 || request.status === 304 || request.status === 0;
                },
                load: function (url, next, nextContext) {
                    var request = new XMLHttpRequest();
                    if (scope.flags.debug || scope.flags.bust) {
                        url += "?" + Math.random();
                    }
                    request.open("GET", url, xhr.async);
                    request.addEventListener("readystatechange", function (e) {
                        if (request.readyState === 4) {
                            var redirectedUrl = null;
                            try {
                                var locationHeader = request.getResponseHeader("Location");
                                if (locationHeader) {
                                    redirectedUrl = locationHeader.substr(0, 1) === "/" ? location.origin + locationHeader : locationHeader;
                                }
                            } catch (e) {
                                console.error(e.message);
                            }
                            next.call(nextContext, !xhr.ok(request) && request, request.response || request.responseText, redirectedUrl);
                        }
                    });
                    request.send();
                    return request;
                },
                loadDocument: function (url, next, nextContext) {
                    this.load(url, next, nextContext).responseType = "document";
                }
            };
            scope.xhr = xhr;
        });
        window.HTMLImports.addModule(function (scope) {
            var xhr = scope.xhr;
            var flags = scope.flags;
            var Loader = function (onLoad, onComplete) {
                this.cache = {};
                this.onload = onLoad;
                this.oncomplete = onComplete;
                this.inflight = 0;
                this.pending = {};
            };
            Loader.prototype = {
                addNodes: function (nodes) {
                    this.inflight += nodes.length;
                    for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
                        this.require(n);
                    }
                    this.checkDone();
                },
                addNode: function (node) {
                    this.inflight++;
                    this.require(node);
                    this.checkDone();
                },
                require: function (elt) {
                    var url = elt.src || elt.href;
                    elt.__nodeUrl = url;
                    if (!this.dedupe(url, elt)) {
                        this.fetch(url, elt);
                    }
                },
                dedupe: function (url, elt) {
                    if (this.pending[url]) {
                        this.pending[url].push(elt);
                        return true;
                    }
                    var resource;
                    if (this.cache[url]) {
                        this.onload(url, elt, this.cache[url]);
                        this.tail();
                        return true;
                    }
                    this.pending[url] = [elt];
                    return false;
                },
                fetch: function (url, elt) {
                    flags.load && console.log("fetch", url, elt);
                    if (!url) {
                        setTimeout(function () {
                            this.receive(url, elt, {
                                error: "href must be specified"
                            }, null);
                        }.bind(this), 0);
                    } else if (url.match(/^data:/)) {
                        var pieces = url.split(",");
                        var header = pieces[0];
                        var body = pieces[1];
                        if (header.indexOf(";base64") > -1) {
                            body = atob(body);
                        } else {
                            body = decodeURIComponent(body);
                        }
                        setTimeout(function () {
                            this.receive(url, elt, null, body);
                        }.bind(this), 0);
                    } else {
                        var receiveXhr = function (err, resource, redirectedUrl) {
                            this.receive(url, elt, err, resource, redirectedUrl);
                        }.bind(this);
                        xhr.load(url, receiveXhr);
                    }
                },
                receive: function (url, elt, err, resource, redirectedUrl) {
                    this.cache[url] = resource;
                    var $p = this.pending[url];
                    for (var i = 0, l = $p.length, p; i < l && (p = $p[i]); i++) {
                        this.onload(url, p, resource, err, redirectedUrl);
                        this.tail();
                    }
                    this.pending[url] = null;
                },
                tail: function () {
                    --this.inflight;
                    this.checkDone();
                },
                checkDone: function () {
                    if (!this.inflight) {
                        this.oncomplete();
                    }
                }
            };
            scope.Loader = Loader;
        });
        window.HTMLImports.addModule(function (scope) {
            var Observer = function (addCallback) {
                this.addCallback = addCallback;
                this.mo = new MutationObserver(this.handler.bind(this));
            };
            Observer.prototype = {
                handler: function (mutations) {
                    for (var i = 0, l = mutations.length, m; i < l && (m = mutations[i]); i++) {
                        if (m.type === "childList" && m.addedNodes.length) {
                            this.addedNodes(m.addedNodes);
                        }
                    }
                },
                addedNodes: function (nodes) {
                    if (this.addCallback) {
                        this.addCallback(nodes);
                    }
                    for (var i = 0, l = nodes.length, n, loading; i < l && (n = nodes[i]); i++) {
                        if (n.children && n.children.length) {
                            this.addedNodes(n.children);
                        }
                    }
                },
                observe: function (root) {
                    this.mo.observe(root, {
                        childList: true,
                        subtree: true
                    });
                }
            };
            scope.Observer = Observer;
        });
        window.HTMLImports.addModule(function (scope) {
            var path = scope.path;
            var rootDocument = scope.rootDocument;
            var flags = scope.flags;
            var isIE = scope.isIE;
            var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;
            var IMPORT_SELECTOR = "link[rel=" + IMPORT_LINK_TYPE + "]";
            var importParser = {
                documentSelectors: IMPORT_SELECTOR,
                importsSelectors: [IMPORT_SELECTOR, "link[rel=stylesheet]:not([type])", "style:not([type])", "script:not([type])", 'script[type="application/javascript"]', 'script[type="text/javascript"]'].join(","),
                map: {
                    link: "parseLink",
                    script: "parseScript",
                    style: "parseStyle"
                },
                dynamicElements: [],
                parseNext: function () {
                    var next = this.nextToParse();
                    if (next) {
                        this.parse(next);
                    }
                },
                parse: function (elt) {
                    if (this.isParsed(elt)) {
                        flags.parse && console.log("[%s] is already parsed", elt.localName);
                        return;
                    }
                    var fn = this[this.map[elt.localName]];
                    if (fn) {
                        this.markParsing(elt);
                        fn.call(this, elt);
                    }
                },
                parseDynamic: function (elt, quiet) {
                    this.dynamicElements.push(elt);
                    if (!quiet) {
                        this.parseNext();
                    }
                },
                markParsing: function (elt) {
                    flags.parse && console.log("parsing", elt);
                    this.parsingElement = elt;
                },
                markParsingComplete: function (elt) {
                    elt.__importParsed = true;
                    this.markDynamicParsingComplete(elt);
                    if (elt.__importElement) {
                        elt.__importElement.__importParsed = true;
                        this.markDynamicParsingComplete(elt.__importElement);
                    }
                    this.parsingElement = null;
                    flags.parse && console.log("completed", elt);
                },
                markDynamicParsingComplete: function (elt) {
                    var i = this.dynamicElements.indexOf(elt);
                    if (i >= 0) {
                        this.dynamicElements.splice(i, 1);
                    }
                },
                parseImport: function (elt) {
                    elt.import = elt.__doc;
                    if (window.HTMLImports.__importsParsingHook) {
                        window.HTMLImports.__importsParsingHook(elt);
                    }
                    if (elt.import) {
                        elt.import.__importParsed = true;
                    }
                    this.markParsingComplete(elt);
                    if (elt.__resource && !elt.__error) {
                        elt.dispatchEvent(new CustomEvent("load", {
                            bubbles: false
                        }));
                    } else {
                        elt.dispatchEvent(new CustomEvent("error", {
                            bubbles: false
                        }));
                    }
                    if (elt.__pending) {
                        var fn;
                        while (elt.__pending.length) {
                            fn = elt.__pending.shift();
                            if (fn) {
                                fn({
                                    target: elt
                                });
                            }
                        }
                    }
                    this.parseNext();
                },
                parseLink: function (linkElt) {
                    if (nodeIsImport(linkElt)) {
                        this.parseImport(linkElt);
                    } else {
                        linkElt.href = linkElt.href;
                        this.parseGeneric(linkElt);
                    }
                },
                parseStyle: function (elt) {
                    var src = elt;
                    elt = cloneStyle(elt);
                    src.__appliedElement = elt;
                    elt.__importElement = src;
                    this.parseGeneric(elt);
                },
                parseGeneric: function (elt) {
                    this.trackElement(elt);
                    this.addElementToDocument(elt);
                },
                rootImportForElement: function (elt) {
                    var n = elt;
                    while (n.ownerDocument.__importLink) {
                        n = n.ownerDocument.__importLink;
                    }
                    return n;
                },
                addElementToDocument: function (elt) {
                    var port = this.rootImportForElement(elt.__importElement || elt);
                    port.parentNode.insertBefore(elt, port);
                },
                trackElement: function (elt, callback) {
                    var self = this;
                    var done = function (e) {
                        elt.removeEventListener("load", done);
                        elt.removeEventListener("error", done);
                        if (callback) {
                            callback(e);
                        }
                        self.markParsingComplete(elt);
                        self.parseNext();
                    };
                    elt.addEventListener("load", done);
                    elt.addEventListener("error", done);
                    if (isIE && elt.localName === "style") {
                        var fakeLoad = false;
                        if (elt.textContent.indexOf("@import") == -1) {
                            fakeLoad = true;
                        } else if (elt.sheet) {
                            fakeLoad = true;
                            var csr = elt.sheet.cssRules;
                            var len = csr ? csr.length : 0;
                            for (var i = 0, r; i < len && (r = csr[i]); i++) {
                                if (r.type === CSSRule.IMPORT_RULE) {
                                    fakeLoad = fakeLoad && Boolean(r.styleSheet);
                                }
                            }
                        }
                        if (fakeLoad) {
                            setTimeout(function () {
                                elt.dispatchEvent(new CustomEvent("load", {
                                    bubbles: false
                                }));
                            });
                        }
                    }
                },
                parseScript: function (scriptElt) {
                    var script = document.createElement("script");
                    script.__importElement = scriptElt;
                    script.src = scriptElt.src ? scriptElt.src : generateScriptDataUrl(scriptElt);
                    scope.currentScript = scriptElt;
                    this.trackElement(script, function (e) {
                        if (script.parentNode) {
                            script.parentNode.removeChild(script);
                        }
                        scope.currentScript = null;
                    });
                    this.addElementToDocument(script);
                },
                nextToParse: function () {
                    this._mayParse = [];
                    return !this.parsingElement && (this.nextToParseInDoc(rootDocument) || this.nextToParseDynamic());
                },
                nextToParseInDoc: function (doc, link) {
                    if (doc && this._mayParse.indexOf(doc) < 0) {
                        this._mayParse.push(doc);
                        var nodes = doc.querySelectorAll(this.parseSelectorsForNode(doc));
                        for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
                            if (!this.isParsed(n)) {
                                if (this.hasResource(n)) {
                                    return nodeIsImport(n) ? this.nextToParseInDoc(n.__doc, n) : n;
                                } else {
                                    return;
                                }
                            }
                        }
                    }
                    return link;
                },
                nextToParseDynamic: function () {
                    return this.dynamicElements[0];
                },
                parseSelectorsForNode: function (node) {
                    var doc = node.ownerDocument || node;
                    return doc === rootDocument ? this.documentSelectors : this.importsSelectors;
                },
                isParsed: function (node) {
                    return node.__importParsed;
                },
                needsDynamicParsing: function (elt) {
                    return this.dynamicElements.indexOf(elt) >= 0;
                },
                hasResource: function (node) {
                    if (nodeIsImport(node) && node.__doc === undefined) {
                        return false;
                    }
                    return true;
                }
            };
            function nodeIsImport(elt) {
                return elt.localName === "link" && elt.rel === IMPORT_LINK_TYPE;
            }
            function generateScriptDataUrl(script) {
                var scriptContent = generateScriptContent(script);
                return "data:text/javascript;charset=utf-8," + encodeURIComponent(scriptContent);
            }
            function generateScriptContent(script) {
                return script.textContent + generateSourceMapHint(script);
            }
            function generateSourceMapHint(script) {
                var owner = script.ownerDocument;
                owner.__importedScripts = owner.__importedScripts || 0;
                var moniker = script.ownerDocument.baseURI;
                var num = owner.__importedScripts ? "-" + owner.__importedScripts : "";
                owner.__importedScripts++;
                return "\n//# sourceURL=" + moniker + num + ".js\n";
            }
            function cloneStyle(style) {
                var clone = style.ownerDocument.createElement("style");
                clone.textContent = style.textContent;
                path.resolveUrlsInStyle(clone);
                return clone;
            }
            scope.parser = importParser;
            scope.IMPORT_SELECTOR = IMPORT_SELECTOR;
        });
        window.HTMLImports.addModule(function (scope) {
            var flags = scope.flags;
            var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;
            var IMPORT_SELECTOR = scope.IMPORT_SELECTOR;
            var rootDocument = scope.rootDocument;
            var Loader = scope.Loader;
            var Observer = scope.Observer;
            var parser = scope.parser;
            var importer = {
                documents: {},
                documentPreloadSelectors: IMPORT_SELECTOR,
                importsPreloadSelectors: [IMPORT_SELECTOR].join(","),
                loadNode: function (node) {
                    importLoader.addNode(node);
                },
                loadSubtree: function (parent) {
                    var nodes = this.marshalNodes(parent);
                    importLoader.addNodes(nodes);
                },
                marshalNodes: function (parent) {
                    return parent.querySelectorAll(this.loadSelectorsForNode(parent));
                },
                loadSelectorsForNode: function (node) {
                    var doc = node.ownerDocument || node;
                    return doc === rootDocument ? this.documentPreloadSelectors : this.importsPreloadSelectors;
                },
                loaded: function (url, elt, resource, err, redirectedUrl) {
                    flags.load && console.log("loaded", url, elt);
                    elt.__resource = resource;
                    elt.__error = err;
                    if (isImportLink(elt)) {
                        var doc = this.documents[url];
                        if (doc === undefined) {
                            doc = err ? null : makeDocument(resource, redirectedUrl || url);
                            if (doc) {
                                doc.__importLink = elt;
                                this.bootDocument(doc);
                            }
                            this.documents[url] = doc;
                        }
                        elt.__doc = doc;
                    }
                    parser.parseNext();
                },
                bootDocument: function (doc) {
                    this.loadSubtree(doc);
                    this.observer.observe(doc);
                    parser.parseNext();
                },
                loadedAll: function () {
                    parser.parseNext();
                }
            };
            var importLoader = new Loader(importer.loaded.bind(importer), importer.loadedAll.bind(importer));
            importer.observer = new Observer();
            function isImportLink(elt) {
                return isLinkRel(elt, IMPORT_LINK_TYPE);
            }
            function isLinkRel(elt, rel) {
                return elt.localName === "link" && elt.getAttribute("rel") === rel;
            }
            function hasBaseURIAccessor(doc) {
                return !!Object.getOwnPropertyDescriptor(doc, "baseURI");
            }
            function makeDocument(resource, url) {
                var doc = document.implementation.createHTMLDocument(IMPORT_LINK_TYPE);
                doc._URL = url;
                var base = doc.createElement("base");
                base.setAttribute("href", url);
                if (!doc.baseURI && !hasBaseURIAccessor(doc)) {
                    Object.defineProperty(doc, "baseURI", {
                        value: url
                    });
                }
                var meta = doc.createElement("meta");
                meta.setAttribute("charset", "utf-8");
                doc.head.appendChild(meta);
                doc.head.appendChild(base);
                doc.body.innerHTML = resource;
                if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
                    HTMLTemplateElement.bootstrap(doc);
                }
                return doc;
            }
            if (!document.baseURI) {
                var baseURIDescriptor = {
                    get: function () {
                        var base = document.querySelector("base");
                        return base ? base.href : window.location.href;
                    },
                    configurable: true
                };
                Object.defineProperty(document, "baseURI", baseURIDescriptor);
                Object.defineProperty(rootDocument, "baseURI", baseURIDescriptor);
            }
            scope.importer = importer;
            scope.importLoader = importLoader;
        });
        window.HTMLImports.addModule(function (scope) {
            var parser = scope.parser;
            var importer = scope.importer;
            var dynamic = {
                added: function (nodes) {
                    var owner, parsed, loading;
                    for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
                        if (!owner) {
                            owner = n.ownerDocument;
                            parsed = parser.isParsed(owner);
                        }
                        loading = this.shouldLoadNode(n);
                        if (loading) {
                            importer.loadNode(n);
                        }
                        if (this.shouldParseNode(n) && parsed) {
                            parser.parseDynamic(n, loading);
                        }
                    }
                },
                shouldLoadNode: function (node) {
                    return node.nodeType === 1 && matches.call(node, importer.loadSelectorsForNode(node));
                },
                shouldParseNode: function (node) {
                    return node.nodeType === 1 && matches.call(node, parser.parseSelectorsForNode(node));
                }
            };
            importer.observer.addCallback = dynamic.added.bind(dynamic);
            var matches = HTMLElement.prototype.matches || HTMLElement.prototype.matchesSelector || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector;
        });
        (function (scope) {
            var initializeModules = scope.initializeModules;
            var isIE = scope.isIE;
            if (scope.useNative) {
                return;
            }
            initializeModules();
            var rootDocument = scope.rootDocument;
            function bootstrap() {
                window.HTMLImports.importer.bootDocument(rootDocument);
            }
            if (document.readyState === "complete" || document.readyState === "interactive" && !window.attachEvent) {
                bootstrap();
            } else {
                document.addEventListener("DOMContentLoaded", bootstrap);
            }
        })(window.HTMLImports);
        window.CustomElements = window.CustomElements || {
            flags: {}
        };
        (function (scope) {
            var flags = scope.flags;
            var modules = [];
            var addModule = function (module) {
                modules.push(module);
            };
            var initializeModules = function () {
                modules.forEach(function (module) {
                    module(scope);
                });
            };
            scope.addModule = addModule;
            scope.initializeModules = initializeModules;
            scope.hasNative = Boolean(document.registerElement);
            scope.isIE = /Trident/.test(navigator.userAgent);
            scope.useNative = !flags.register && scope.hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || window.HTMLImports.useNative);
        })(window.CustomElements);
        window.CustomElements.addModule(function (scope) {
            var IMPORT_LINK_TYPE = window.HTMLImports ? window.HTMLImports.IMPORT_LINK_TYPE : "none";
            function forSubtree(node, cb) {
                findAllElements(node, function (e) {
                    if (cb(e)) {
                        return true;
                    }
                    forRoots(e, cb);
                });
                forRoots(node, cb);
            }
            function findAllElements(node, find, data) {
                var e = node.firstElementChild;
                if (!e) {
                    e = node.firstChild;
                    while (e && e.nodeType !== Node.ELEMENT_NODE) {
                        e = e.nextSibling;
                    }
                }
                while (e) {
                    if (find(e, data) !== true) {
                        findAllElements(e, find, data);
                    }
                    e = e.nextElementSibling;
                }
                return null;
            }
            function forRoots(node, cb) {
                var root = node.shadowRoot;
                while (root) {
                    forSubtree(root, cb);
                    root = root.olderShadowRoot;
                }
            }
            function forDocumentTree(doc, cb) {
                _forDocumentTree(doc, cb, []);
            }
            function _forDocumentTree(doc, cb, processingDocuments) {
                doc = window.wrap(doc);
                if (processingDocuments.indexOf(doc) >= 0) {
                    return;
                }
                processingDocuments.push(doc);
                var imports = doc.querySelectorAll("link[rel=" + IMPORT_LINK_TYPE + "]");
                for (var i = 0, l = imports.length, n; i < l && (n = imports[i]); i++) {
                    if (n.import) {
                        _forDocumentTree(n.import, cb, processingDocuments);
                    }
                }
                cb(doc);
            }
            scope.forDocumentTree = forDocumentTree;
            scope.forSubtree = forSubtree;
        });
        window.CustomElements.addModule(function (scope) {
            var flags = scope.flags;
            var forSubtree = scope.forSubtree;
            var forDocumentTree = scope.forDocumentTree;
            function addedNode(node, isAttached) {
                return added(node, isAttached) || addedSubtree(node, isAttached);
            }
            function added(node, isAttached) {
                if (scope.upgrade(node, isAttached)) {
                    return true;
                }
                if (isAttached) {
                    attached(node);
                }
            }
            function addedSubtree(node, isAttached) {
                forSubtree(node, function (e) {
                    if (added(e, isAttached)) {
                        return true;
                    }
                });
            }
            var hasThrottledAttached = window.MutationObserver._isPolyfilled && flags["throttle-attached"];
            scope.hasPolyfillMutations = hasThrottledAttached;
            scope.hasThrottledAttached = hasThrottledAttached;
            var isPendingMutations = false;
            var pendingMutations = [];
            function deferMutation(fn) {
                pendingMutations.push(fn);
                if (!isPendingMutations) {
                    isPendingMutations = true;
                    setTimeout(takeMutations);
                }
            }
            function takeMutations() {
                isPendingMutations = false;
                var $p = pendingMutations;
                for (var i = 0, l = $p.length, p; i < l && (p = $p[i]); i++) {
                    p();
                }
                pendingMutations = [];
            }
            function attached(element) {
                if (hasThrottledAttached) {
                    deferMutation(function () {
                        _attached(element);
                    });
                } else {
                    _attached(element);
                }
            }
            function _attached(element) {
                if (element.__upgraded__ && !element.__attached) {
                    element.__attached = true;
                    if (element.attachedCallback) {
                        element.attachedCallback();
                    }
                }
            }
            function detachedNode(node) {
                detached(node);
                forSubtree(node, function (e) {
                    detached(e);
                });
            }
            function detached(element) {
                if (hasThrottledAttached) {
                    deferMutation(function () {
                        _detached(element);
                    });
                } else {
                    _detached(element);
                }
            }
            function _detached(element) {
                if (element.__upgraded__ && element.__attached) {
                    element.__attached = false;
                    if (element.detachedCallback) {
                        element.detachedCallback();
                    }
                }
            }
            function inDocument(element) {
                var p = element;
                var doc = window.wrap(document);
                while (p) {
                    if (p == doc) {
                        return true;
                    }
                    p = p.parentNode || p.nodeType === Node.DOCUMENT_FRAGMENT_NODE && p.host;
                }
            }
            function watchShadow(node) {
                if (node.shadowRoot && !node.shadowRoot.__watched) {
                    flags.dom && console.log("watching shadow-root for: ", node.localName);
                    var root = node.shadowRoot;
                    while (root) {
                        observe(root);
                        root = root.olderShadowRoot;
                    }
                }
            }
            function handler(root, mutations) {
                if (flags.dom) {
                    var mx = mutations[0];
                    if (mx && mx.type === "childList" && mx.addedNodes) {
                        if (mx.addedNodes) {
                            var d = mx.addedNodes[0];
                            while (d && d !== document && !d.host) {
                                d = d.parentNode;
                            }
                            var u = d && (d.URL || d._URL || d.host && d.host.localName) || "";
                            u = u.split("/?").shift().split("/").pop();
                        }
                    }
                    console.group("mutations (%d) [%s]", mutations.length, u || "");
                }
                var isAttached = inDocument(root);
                mutations.forEach(function (mx) {
                    if (mx.type === "childList") {
                        forEach(mx.addedNodes, function (n) {
                            if (!n.localName) {
                                return;
                            }
                            addedNode(n, isAttached);
                        });
                        forEach(mx.removedNodes, function (n) {
                            if (!n.localName) {
                                return;
                            }
                            detachedNode(n);
                        });
                    }
                });
                flags.dom && console.groupEnd();
            }
            function takeRecords(node) {
                node = window.wrap(node);
                if (!node) {
                    node = window.wrap(document);
                }
                while (node.parentNode) {
                    node = node.parentNode;
                }
                var observer = node.__observer;
                if (observer) {
                    handler(node, observer.takeRecords());
                    takeMutations();
                }
            }
            var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
            function observe(inRoot) {
                if (inRoot.__observer) {
                    return;
                }
                var observer = new MutationObserver(handler.bind(this, inRoot));
                observer.observe(inRoot, {
                    childList: true,
                    subtree: true
                });
                inRoot.__observer = observer;
            }
            function upgradeDocument(doc) {
                doc = window.wrap(doc);
                flags.dom && console.group("upgradeDocument: ", doc.baseURI.split("/").pop());
                var isMainDocument = doc === window.wrap(document);
                addedNode(doc, isMainDocument);
                observe(doc);
                flags.dom && console.groupEnd();
            }
            function upgradeDocumentTree(doc) {
                forDocumentTree(doc, upgradeDocument);
            }
            var originalCreateShadowRoot = Element.prototype.createShadowRoot;
            if (originalCreateShadowRoot) {
                Element.prototype.createShadowRoot = function () {
                    var root = originalCreateShadowRoot.call(this);
                    window.CustomElements.watchShadow(this);
                    return root;
                };
            }
            scope.watchShadow = watchShadow;
            scope.upgradeDocumentTree = upgradeDocumentTree;
            scope.upgradeDocument = upgradeDocument;
            scope.upgradeSubtree = addedSubtree;
            scope.upgradeAll = addedNode;
            scope.attached = attached;
            scope.takeRecords = takeRecords;
        });
        window.CustomElements.addModule(function (scope) {
            var flags = scope.flags;
            function upgrade(node, isAttached) {
                if (node.localName === "template") {
                    if (window.HTMLTemplateElement && HTMLTemplateElement.decorate) {
                        HTMLTemplateElement.decorate(node);
                    }
                }
                if (!node.__upgraded__ && node.nodeType === Node.ELEMENT_NODE) {
                    var is = node.getAttribute("is");
                    var definition = scope.getRegisteredDefinition(node.localName) || scope.getRegisteredDefinition(is);
                    if (definition) {
                        if (is && definition.tag == node.localName || !is && !definition.extends) {
                            return upgradeWithDefinition(node, definition, isAttached);
                        }
                    }
                }
            }
            function upgradeWithDefinition(element, definition, isAttached) {
                flags.upgrade && console.group("upgrade:", element.localName);
                if (definition.is) {
                    element.setAttribute("is", definition.is);
                }
                implementPrototype(element, definition);
                element.__upgraded__ = true;
                created(element);
                if (isAttached) {
                    scope.attached(element);
                }
                scope.upgradeSubtree(element, isAttached);
                flags.upgrade && console.groupEnd();
                return element;
            }
            function implementPrototype(element, definition) {
                if (Object.__proto__) {
                    element.__proto__ = definition.prototype;
                } else {
                    customMixin(element, definition.prototype, definition.native);
                    element.__proto__ = definition.prototype;
                }
            }
            function customMixin(inTarget, inSrc, inNative) {
                var used = {};
                var p = inSrc;
                while (p !== inNative && p !== HTMLElement.prototype) {
                    var keys = Object.getOwnPropertyNames(p);
                    for (var i = 0, k; k = keys[i]; i++) {
                        if (!used[k]) {
                            Object.defineProperty(inTarget, k, Object.getOwnPropertyDescriptor(p, k));
                            used[k] = 1;
                        }
                    }
                    p = Object.getPrototypeOf(p);
                }
            }
            function created(element) {
                if (element.createdCallback) {
                    element.createdCallback();
                }
            }
            scope.upgrade = upgrade;
            scope.upgradeWithDefinition = upgradeWithDefinition;
            scope.implementPrototype = implementPrototype;
        });
        window.CustomElements.addModule(function (scope) {
            var isIE = scope.isIE;
            var upgradeDocumentTree = scope.upgradeDocumentTree;
            var upgradeAll = scope.upgradeAll;
            var upgradeWithDefinition = scope.upgradeWithDefinition;
            var implementPrototype = scope.implementPrototype;
            var useNative = scope.useNative;
            function register(name, options) {
                var definition = options || {};
                if (!name) {
                    throw new Error("document.registerElement: first argument `name` must not be empty");
                }
                if (name.indexOf("-") < 0) {
                    throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(name) + "'.");
                }
                if (isReservedTag(name)) {
                    throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(name) + "'. The type name is invalid.");
                }
                if (getRegisteredDefinition(name)) {
                    throw new Error("DuplicateDefinitionError: a type with name '" + String(name) + "' is already registered");
                }
                if (!definition.prototype) {
                    definition.prototype = Object.create(HTMLElement.prototype);
                }
                definition.__name = name.toLowerCase();
                if (definition.extends) {
                    definition.extends = definition.extends.toLowerCase();
                }
                definition.lifecycle = definition.lifecycle || {};
                definition.ancestry = ancestry(definition.extends);
                resolveTagName(definition);
                resolvePrototypeChain(definition);
                overrideAttributeApi(definition.prototype);
                registerDefinition(definition.__name, definition);
                definition.ctor = generateConstructor(definition);
                definition.ctor.prototype = definition.prototype;
                definition.prototype.constructor = definition.ctor;
                if (scope.ready) {
                    upgradeDocumentTree(document);
                }
                return definition.ctor;
            }
            function overrideAttributeApi(prototype) {
                if (prototype.setAttribute._polyfilled) {
                    return;
                }
                var setAttribute = prototype.setAttribute;
                prototype.setAttribute = function (name, value) {
                    changeAttribute.call(this, name, value, setAttribute);
                };
                var removeAttribute = prototype.removeAttribute;
                prototype.removeAttribute = function (name) {
                    changeAttribute.call(this, name, null, removeAttribute);
                };
                prototype.setAttribute._polyfilled = true;
            }
            function changeAttribute(name, value, operation) {
                name = name.toLowerCase();
                var oldValue = this.getAttribute(name);
                operation.apply(this, arguments);
                var newValue = this.getAttribute(name);
                if (this.attributeChangedCallback && newValue !== oldValue) {
                    this.attributeChangedCallback(name, oldValue, newValue);
                }
            }
            function isReservedTag(name) {
                for (var i = 0; i < reservedTagList.length; i++) {
                    if (name === reservedTagList[i]) {
                        return true;
                    }
                }
            }
            var reservedTagList = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"];
            function ancestry(extnds) {
                var extendee = getRegisteredDefinition(extnds);
                if (extendee) {
                    return ancestry(extendee.extends).concat([extendee]);
                }
                return [];
            }
            function resolveTagName(definition) {
                var baseTag = definition.extends;
                for (var i = 0, a; a = definition.ancestry[i]; i++) {
                    baseTag = a.is && a.tag;
                }
                definition.tag = baseTag || definition.__name;
                if (baseTag) {
                    definition.is = definition.__name;
                }
            }
            function resolvePrototypeChain(definition) {
                if (!Object.__proto__) {
                    var nativePrototype = HTMLElement.prototype;
                    if (definition.is) {
                        var inst = document.createElement(definition.tag);
                        nativePrototype = Object.getPrototypeOf(inst);
                    }
                    var proto = definition.prototype, ancestor;
                    var foundPrototype = false;
                    while (proto) {
                        if (proto == nativePrototype) {
                            foundPrototype = true;
                        }
                        ancestor = Object.getPrototypeOf(proto);
                        if (ancestor) {
                            proto.__proto__ = ancestor;
                        }
                        proto = ancestor;
                    }
                    if (!foundPrototype) {
                        console.warn(definition.tag + " prototype not found in prototype chain for " + definition.is);
                    }
                    definition.native = nativePrototype;
                }
            }
            function instantiate(definition) {
                return upgradeWithDefinition(domCreateElement(definition.tag), definition);
            }
            var registry = {};
            function getRegisteredDefinition(name) {
                if (name) {
                    return registry[name.toLowerCase()];
                }
            }
            function registerDefinition(name, definition) {
                registry[name] = definition;
            }
            function generateConstructor(definition) {
                return function () {
                    return instantiate(definition);
                };
            }
            var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
            function createElementNS(namespace, tag, typeExtension) {
                if (namespace === HTML_NAMESPACE) {
                    return createElement(tag, typeExtension);
                } else {
                    return domCreateElementNS(namespace, tag);
                }
            }
            function createElement(tag, typeExtension) {
                if (tag) {
                    tag = tag.toLowerCase();
                }
                if (typeExtension) {
                    typeExtension = typeExtension.toLowerCase();
                }
                var definition = getRegisteredDefinition(typeExtension || tag);
                if (definition) {
                    if (tag == definition.tag && typeExtension == definition.is) {
                        return new definition.ctor();
                    }
                    if (!typeExtension && !definition.is) {
                        return new definition.ctor();
                    }
                }
                var element;
                if (typeExtension) {
                    element = createElement(tag);
                    element.setAttribute("is", typeExtension);
                    return element;
                }
                element = domCreateElement(tag);
                if (tag.indexOf("-") >= 0) {
                    implementPrototype(element, HTMLElement);
                }
                return element;
            }
            var domCreateElement = document.createElement.bind(document);
            var domCreateElementNS = document.createElementNS.bind(document);
            var isInstance;
            if (!Object.__proto__ && !useNative) {
                isInstance = function (obj, ctor) {
                    if (obj instanceof ctor) {
                        return true;
                    }
                    var p = obj;
                    while (p) {
                        if (p === ctor.prototype) {
                            return true;
                        }
                        p = p.__proto__;
                    }
                    return false;
                };
            } else {
                isInstance = function (obj, base) {
                    return obj instanceof base;
                };
            }
            function wrapDomMethodToForceUpgrade(obj, methodName) {
                var orig = obj[methodName];
                obj[methodName] = function () {
                    var n = orig.apply(this, arguments);
                    upgradeAll(n);
                    return n;
                };
            }
            wrapDomMethodToForceUpgrade(Node.prototype, "cloneNode");
            wrapDomMethodToForceUpgrade(document, "importNode");
            document.registerElement = register;
            document.createElement = createElement;
            document.createElementNS = createElementNS;
            scope.registry = registry;
            scope.instanceof = isInstance;
            scope.reservedTagList = reservedTagList;
            scope.getRegisteredDefinition = getRegisteredDefinition;
            document.register = document.registerElement;
        });
        (function (scope) {
            var useNative = scope.useNative;
            var initializeModules = scope.initializeModules;
            var isIE = scope.isIE;
            if (useNative) {
                var nop = function () { };
                scope.watchShadow = nop;
                scope.upgrade = nop;
                scope.upgradeAll = nop;
                scope.upgradeDocumentTree = nop;
                scope.upgradeSubtree = nop;
                scope.takeRecords = nop;
                scope.instanceof = function (obj, base) {
                    return obj instanceof base;
                };
            } else {
                initializeModules();
            }
            var upgradeDocumentTree = scope.upgradeDocumentTree;
            var upgradeDocument = scope.upgradeDocument;
            if (!window.wrap) {
                if (window.ShadowDOMPolyfill) {
                    window.wrap = window.ShadowDOMPolyfill.wrapIfNeeded;
                    window.unwrap = window.ShadowDOMPolyfill.unwrapIfNeeded;
                } else {
                    window.wrap = window.unwrap = function (node) {
                        return node;
                    };
                }
            }
            if (window.HTMLImports) {
                window.HTMLImports.__importsParsingHook = function (elt) {
                    if (elt.import) {
                        upgradeDocument(wrap(elt.import));
                    }
                };
            }
            function bootstrap() {
                upgradeDocumentTree(window.wrap(document));
                window.CustomElements.ready = true;
                var requestAnimationFrame = window.requestAnimationFrame || function (f) {
                    setTimeout(f, 16);
                };
                requestAnimationFrame(function () {
                    setTimeout(function () {
                        window.CustomElements.readyTime = Date.now();
                        if (window.HTMLImports) {
                            window.CustomElements.elapsed = window.CustomElements.readyTime - window.HTMLImports.readyTime;
                        }
                        document.dispatchEvent(new CustomEvent("WebComponentsReady", {
                            bubbles: true
                        }));
                    });
                });
            }
            if (document.readyState === "complete" || scope.flags.eager) {
                bootstrap();
            } else if (document.readyState === "interactive" && !window.attachEvent && (!window.HTMLImports || window.HTMLImports.ready)) {
                bootstrap();
            } else {
                var loadEvent = window.HTMLImports && !window.HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
                window.addEventListener(loadEvent, bootstrap);
            }
        })(window.CustomElements);
        (function (scope) {
            var style = document.createElement("style");
            style.textContent = "" + "body {" + "transition: opacity ease-in 0.2s;" + " } \n" + "body[unresolved] {" + "opacity: 0; display: block; overflow: hidden; position: relative;" + " } \n";
            var head = document.querySelector("head");
            head.insertBefore(style, head.firstChild);
        })(window.WebComponents);
    }, {}],
    4: [function (require, module, exports) {
        "use strict";
        var Class = require("class.extend"), _ = require("underscore"), hasConnected = false, ChromecastSessionManager;
        function getCastContext() {
            return cast.framework.CastContext.getInstance();
        }
        ChromecastSessionManager = Class.extend({
            init: function (player) {
                this.player = player;
                this._addCastContextEventListeners();
                this.player.on("dispose", this._removeCastContextEventListeners.bind(this));
                this._notifyPlayerOfDevicesAvailabilityChange(this.getCastContext().getCastState());
                this.remotePlayer = new cast.framework.RemotePlayer();
                this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
            },
            _addCastContextEventListeners: function () {
                var sessionStateChangedEvt = cast.framework.CastContextEventType.SESSION_STATE_CHANGED, castStateChangedEvt = cast.framework.CastContextEventType.CAST_STATE_CHANGED;
                this.getCastContext().addEventListener(sessionStateChangedEvt, this._onSessionStateChange.bind(this));
                this.getCastContext().addEventListener(castStateChangedEvt, this._onCastStateChange.bind(this));
            },
            _removeCastContextEventListeners: function () {
                var sessionStateChangedEvt = cast.framework.CastContextEventType.SESSION_STATE_CHANGED, castStateChangedEvt = cast.framework.CastContextEventType.CAST_STATE_CHANGED;
                this.getCastContext().removeEventListener(sessionStateChangedEvt);
                this.getCastContext().removeEventListener(castStateChangedEvt);
            },
            _onSessionStateChange: function (event) {
                if (event.sessionState === cast.framework.SessionState.SESSION_ENDED) {
                    this.player.trigger("chromecastDisconnected");
                    this._reloadTech();
                }
            },
            _onCastStateChange: function (event) {
                this._notifyPlayerOfDevicesAvailabilityChange(event.castState);
            },
            _notifyPlayerOfDevicesAvailabilityChange: function (castState) {
                if (this.hasAvailableDevices(castState)) {
                    this.player.trigger("chromecastDevicesAvailable");
                } else {
                    this.player.trigger("chromecastDevicesUnavailable");
                }
            },
            hasAvailableDevices: function (castState) {
                castState = castState || this.getCastContext().getCastState();
                return castState === cast.framework.CastState.NOT_CONNECTED || castState === cast.framework.CastState.CONNECTING || castState === cast.framework.CastState.CONNECTED;
            },
            openCastMenu: function () {
                var onSessionSuccess;
                if (!this.player.currentSource()) {
                    return;
                }
                onSessionSuccess = function () {
                    hasConnected = true;
                    this.player.trigger("chromecastConnected");
                    this._reloadTech();
                }.bind(this);
                this.getCastContext().requestSession().then(onSessionSuccess, _.noop);
            },
            _reloadTech: function () {
                var player = this.player, currentTime = player.currentTime(), wasPaused = player.paused(), sources = player.currentSources();
                player.src(sources);
                player.ready(function () {
                    if (wasPaused) {
                        player.pause();
                    } else {
                        player.play();
                    }
                    player.currentTime(currentTime || 0);
                });
            },
            getCastContext: getCastContext,
            getRemotePlayer: function () {
                return this.remotePlayer;
            },
            getRemotePlayerController: function () {
                return this.remotePlayerController;
            }
        });
        ChromecastSessionManager.isChromecastAPIAvailable = function () {
            return window.chrome && window.chrome.cast && window.cast;
        };
        ChromecastSessionManager.isChromecastConnected = function () {
            return ChromecastSessionManager.isChromecastAPIAvailable() && getCastContext().getCastState() === cast.framework.CastState.CONNECTED && hasConnected;
        };
        module.exports = ChromecastSessionManager;
    }, {
        "class.extend": 1,
        underscore: 2
    }],
    5: [function (require, module, exports) {
        "use strict";
        class ChromecastButton extends videojs.getComponent("Button") {
            constructor(player) {
                this.constructor.super_.apply(this, arguments);
                player.on("chromecastConnected", this._onChromecastConnected.bind(this));
                player.on("chromecastDisconnected", this._onChromecastDisconnected.bind(this));
                player.on("chromecastDevicesAvailable", this._onChromecastDevicesAvailable.bind(this));
                player.on("chromecastDevicesUnavailable", this._onChromecastDevicesUnavailable.bind(this));
                this.controlText("Open Chromecast menu");
                if (player.chromecastSessionManager && player.chromecastSessionManager.hasAvailableDevices()) {
                    this._onChromecastDevicesAvailable();
                } else {
                    this._onChromecastDevicesUnavailable();
                }
            }
            buildCSSClass() {
                return "vjs-chromecast-button " + (this._isChromecastConnected ? "vjs-chromecast-casting-state " : "") + this.constructor.super_.prototype.buildCSSClass();
            }
            handleClick() {
                this.player().trigger("chromecastRequested");
            }
            _onChromecastConnected() {
                this._isChromecastConnected = true;
                this._reloadCSSClasses();
            }
            _onChromecastDisconnected() {
                this._isChromecastConnected = false;
                this._reloadCSSClasses();
            }
            _onChromecastDevicesAvailable() {
                this.show();
            }
            _onChromecastDevicesUnavailable() {
                this.hide();
            }
            _reloadCSSClasses() {
                if (!this.el_) {
                    return;
                }
                this.el_.className = this.buildCSSClass();
            }
        };
        module.exports = function (videojs) {
            videojs.registerComponent("chromecastButton", ChromecastButton);
        };
    }, {}],
    6: [function (require, module, exports) {
        "use strict";
        var ChromecastSessionManager = require("./chromecast/ChromecastSessionManager"), _ = require("underscore"), CHECK_AVAILABILITY_INTERVAL = 1e3, CHECK_AVAILABILITY_TIMEOUT = 30 * 1e3;
        function configureCastContext(options) {
            var context = cast.framework.CastContext.getInstance();
            context.setOptions({
                receiverApplicationId: options.receiverAppID || chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
            });
        }
        function onChromecastRequested(player) {
            player.chromecastSessionManager.openCastMenu();
        }
        function setUpChromecastButton(player, options) {
            var indexOpt;
            if (options.addButtonToControlBar && !player.controlBar.getChild("chromecastButton")) {
                indexOpt = player.controlBar.children().length;
                if (typeof options.buttonPositionIndex !== "undefined") {
                    indexOpt = options.buttonPositionIndex >= 0 ? options.buttonPositionIndex : player.controlBar.children().length + options.buttonPositionIndex;
                }
                player.controlBar.addChild("chromecastButton", options, indexOpt);
            }
            player.on("chromecastRequested", onChromecastRequested.bind(null, player));
        }
        function createSessionManager(player) {
            if (!player.chromecastSessionManager) {
                player.chromecastSessionManager = new ChromecastSessionManager(player);
            }
        }
        function enableChromecast(player, options) {
            configureCastContext(options);
            createSessionManager(player);
            setUpChromecastButton(player, options);
        }
        function waitUntilChromecastAPIsAreAvailable(player, options) {
            var maxTries = CHECK_AVAILABILITY_TIMEOUT / CHECK_AVAILABILITY_INTERVAL, tries = 1, intervalID;
            intervalID = setInterval(function () {
                if (tries > maxTries) {
                    clearInterval(intervalID);
                    return;
                }
                if (ChromecastSessionManager.isChromecastAPIAvailable()) {
                    clearInterval(intervalID);
                    enableChromecast(player, options);
                }
                tries = tries + 1;
            }, CHECK_AVAILABILITY_INTERVAL);
        }
        module.exports = function (videojs) {
            videojs.registerPlugin("chromecast", function (options) {
                var pluginOptions = _.extend({
                    addButtonToControlBar: true
                }, options || {});
                this.ready(function () {
                    if (!this.controlBar) {
                        return;
                    }
                    if (ChromecastSessionManager.isChromecastAPIAvailable()) {
                        enableChromecast(this, pluginOptions);
                    } else {
                        waitUntilChromecastAPIsAreAvailable(this, pluginOptions);
                    }
                }.bind(this));
            });
        };
    }, {
        "./chromecast/ChromecastSessionManager": 4,
        underscore: 2
    }],
    7: [function (require, module, exports) {
        "use strict";
        var _ = require("underscore"), preloadWebComponents = require("./preloadWebComponents"), createChromecastButton = require("./components/ChromecastButton"), createChromecastTech = require("./tech/ChromecastTech"), enableChromecast = require("./enableChromecast");
        module.exports = function (videojs, userOpts) {
            var options = _.defaults(_.extend({}, userOpts), {
                preloadWebComponents: false
            });
            if (options.preloadWebComponents) {
                preloadWebComponents();
            }
            videojs = videojs || window.videojs;
            createChromecastButton(videojs);
            createChromecastTech(videojs);
            enableChromecast(videojs);
        };
    }, {
        "./components/ChromecastButton": 5,
        "./enableChromecast": 6,
        "./preloadWebComponents": 8,
        "./tech/ChromecastTech": 10,
        underscore: 2
    }],
    8: [function (require, module, exports) {
        "use strict";
        var _ = require("underscore");
        function doesUserAgentContainString(str) {
            return _.isString(window.navigator.userAgent) && window.navigator.userAgent.indexOf(str) >= 0;
        }
        module.exports = function () {
            var needsWebComponents = !document.registerElement, iosChrome = doesUserAgentContainString("CriOS"), androidChrome;
            androidChrome = doesUserAgentContainString("Android") && doesUserAgentContainString("Chrome/") && window.navigator.presentation;
            if ((androidChrome || iosChrome) && needsWebComponents) {
                require("webcomponents.js/webcomponents-lite.js");
            }
        };
    }, {
        underscore: 2,
        "webcomponents.js/webcomponents-lite.js": 3
    }],
    9: [function (require, module, exports) {
        "use strict";
        require("./index")(undefined, window.SILVERMINE_VIDEOJS_CHROMECAST_CONFIG);
    }, {
        "./index": 7
    }],
    10: [function (require, module, exports) {
        "use strict";
        var ChromecastSessionManager = require("../chromecast/ChromecastSessionManager"), ChromecastTechUI = require("./ChromecastTechUI"), _ = require("underscore"), SESSION_TIMEOUT = 10 * 1e3;
        class ChromecastTech extends videojs.getComponent("Tech") {
            constructor(options) {
                var subclass;
                this._eventListeners = [];
                this.videojsPlayer = this.videojs(options.playerId);
                this._chromecastSessionManager = this.videojsPlayer.chromecastSessionManager;
                this._ui = new ChromecastTechUI();
                this._ui.updatePoster(this.videojsPlayer.poster());
                subclass = this.constructor.super_.apply(this, arguments);
                this._remotePlayer = this._chromecastSessionManager.getRemotePlayer();
                this._remotePlayerController = this._chromecastSessionManager.getRemotePlayerController();
                this._listenToPlayerControllerEvents();
                this.on("dispose", this._removeAllEventListeners.bind(this));
                this._hasPlayedAnyItem = false;
                this._requestTitle = options.requestTitleFn || _.noop;
                this._requestSubtitle = options.requestSubtitleFn || _.noop;
                this._requestCustomData = options.requestCustomDataFn || _.noop;
                this._initialStartTime = options.startTime || 0;
                this._subtitleCount = options.subtitleCount;
                this._playSource(options.source, this._initialStartTime);
                this.ready(function () {
                    this.setMuted(options.muted);
                }.bind(this));
                return subclass;
            }
            createEl() {
                return this._ui.getDOMElement();
            }
            play() {
                if (!this.paused()) {
                    return;
                }
                if (this.ended() && !this._isMediaLoading) {
                    this._playSource({
                        src: this.videojsPlayer.src()
                    }, 0);
                } else {
                    this._remotePlayerController.playOrPause();
                }
            }
            pause() {
                if (!this.paused() && this._remotePlayer.canPause) {
                    this._remotePlayerController.playOrPause();
                }
            }
            paused() {
                return this._remotePlayer.isPaused || this.ended() || this._remotePlayer.playerState === null;
            }
            setSource(source) {
                if (this._currentSource && this._currentSource.src === source.src && this._currentSource.type === source.type) {
                    return;
                }
                this._currentSource = source;
                this._playSource(source, 0);
            }
            _playSource(source, startTime) {
                var mediaInfo = new chrome.cast.media.MediaInfo(source.src, source.type), title = this._requestTitle(source), subtitle = this._requestSubtitle(source), poster = this.poster(), customData = this._requestCustomData(source), request;
                this.trigger("waiting");
                this._clearSessionTimeout();
                mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
                mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
                mediaInfo.metadata.title = title;
                mediaInfo.metadata.subtitle = subtitle;
                if (poster) {
                    mediaInfo.metadata.images = [{
                        url: poster
                    }];
                }
                if (customData) {
                    mediaInfo.customData = customData;
                }
                this._ui.updateTitle(title);
                this._ui.updateSubtitle(subtitle);
                if (this._subtitleCount) {
                    window.setTimeout(this._deferredLoad.bind(this, mediaInfo, startTime), 1e3);
                } else {
                    request = new chrome.cast.media.LoadRequest(mediaInfo, startTime);
                    request.autoplay = true;
                    request.currentTime = startTime;
                    this._loadMedia(request);
                }
                this.videojsPlayer.remoteTextTracks().on("change", this._onChangeTrack.bind(this));
            }
            _deferredLoad(mediaInfo, startTime) {
                var request, tracks, subtitles, track, i, j;
                subtitles = this.videojsPlayer.remoteTextTracks();
                if (subtitles.length === this._subtitleCount) {
                    tracks = [];
                    for (i = 0; i < subtitles.length; i++) {
                        track = new chrome.cast.media.Track(i, chrome.cast.media.TrackType.TEXT);
                        track.trackContentId = subtitles[i].src;
                        track.trackContentType = "text/vtt";
                        track.subtype = chrome.cast.media.TextTrackType.CAPTIONS;
                        track.name = subtitles[i].label;
                        track.language = subtitles[i].srclang;
                        tracks.push(track);
                    }
                    mediaInfo.tracks = tracks;
                    mediaInfo.textTrackStyle = {
                        backgroundColor: "#00000000",
                        foregroundColor: "#FFFFFFFF",
                        edgeType: "OUTLINE",
                        edgeColor: "#000000FF",
                        windowColor: "#000000FF"
                    };
                    request = new chrome.cast.media.LoadRequest(mediaInfo);
                    request.autoplay = true;
                    request.currentTime = startTime;
                    if (subtitles.length > 0) {
                        for (j = 0; j < subtitles.length; j++) {
                            if (subtitles[j].mode === "showing") {
                                request.activeTrackIds = [j];
                            }
                        }
                    }
                    this._loadMedia(request);
                }
            }
            _onChangeTrack() {
                var index, subtitles, tracksInfoRequest, i;
                if (cast.framework.CastContext.getInstance().b) {
                    index = [];
                    subtitles = this.videojsPlayer.remoteTextTracks();
                    for (i = 0; i < subtitles.length; i++) {
                        if (subtitles[i].mode === "showing") {
                            index = [i];
                        }
                    }
                    tracksInfoRequest = new chrome.cast.media.EditTracksInfoRequest(index);
                    cast.framework.CastContext.getInstance().b.getSessionObj().media[0].editTracksInfo(tracksInfoRequest, null, null);
                }
            }
            _loadMedia(request) {
                this._isMediaLoading = true;
                this._hasPlayedCurrentItem = false;
                this._getCastSession().loadMedia(request).then(function () {
                    if (!this._hasPlayedAnyItem) {
                        this.triggerReady();
                    }
                    this.trigger("loadstart");
                    this.trigger("loadeddata");
                    this.trigger("play");
                    this.trigger("playing");
                    this._hasPlayedAnyItem = true;
                    this._isMediaLoading = false;
                }.bind(this), this._triggerErrorEvent.bind(this));
            }
            setCurrentTime(time) {
                var duration = this.duration();
                if (time > duration || !this._remotePlayer.canSeek) {
                    return;
                }
                this._remotePlayer.currentTime = Math.min(duration - 1, time);
                this._remotePlayerController.seek();
                this._triggerTimeUpdateEvent();
            }
            currentTime() {
                if (!this._hasPlayedAnyItem) {
                    return this._initialStartTime;
                }
                return this._remotePlayer.currentTime;
            }
            duration() {
                if (!this._hasPlayedAnyItem) {
                    return this.videojsPlayer.duration();
                }
                return this._remotePlayer.duration;
            }
            ended() {
                var mediaSession = this._getMediaSession();
                return mediaSession ? mediaSession.idleReason === chrome.cast.media.IdleReason.FINISHED : false;
            }
            volume() {
                return this._remotePlayer.volumeLevel;
            }
            setVolume(volumeLevel) {
                this._remotePlayer.volumeLevel = volumeLevel;
                this._remotePlayerController.setVolumeLevel();
                this._triggerVolumeChangeEvent();
            }
            muted() {
                return this._remotePlayer.isMuted;
            }
            setMuted(isMuted) {
                if (this._remotePlayer.isMuted && !isMuted || !this._remotePlayer.isMuted && isMuted) {
                    this._remotePlayerController.muteOrUnmute();
                }
            }
            poster() {
                return this._ui.getPoster();
            }
            setPoster(poster) {
                this._ui.updatePoster(poster);
            }
            buffered() {
                return undefined;
            }
            seekable() {
                return this.videojs.createTimeRange(0, this.duration());
            }
            controls() {
                return false;
            }
            playsinline() {
                return true;
            }
            supportsFullScreen() {
                return true;
            }
            setAutoplay() { }
            playbackRate() {
                var mediaSession = this._getMediaSession();
                return mediaSession ? mediaSession.playbackRate : 1;
            }
            setPlaybackRate() { }
            load() { }
            readyState() {
                if (this._remotePlayer.playerState === "IDLE" || this._remotePlayer.playerState === "BUFFERING") {
                    return 0;
                }
                return 4;
            }
            _listenToPlayerControllerEvents() {
                var eventTypes = cast.framework.RemotePlayerEventType;
                this._addEventListener(this._remotePlayerController, eventTypes.PLAYER_STATE_CHANGED, this._onPlayerStateChanged, this);
                this._addEventListener(this._remotePlayerController, eventTypes.VOLUME_LEVEL_CHANGED, this._triggerVolumeChangeEvent, this);
                this._addEventListener(this._remotePlayerController, eventTypes.IS_MUTED_CHANGED, this._triggerVolumeChangeEvent, this);
                this._addEventListener(this._remotePlayerController, eventTypes.CURRENT_TIME_CHANGED, this._triggerTimeUpdateEvent, this);
                this._addEventListener(this._remotePlayerController, eventTypes.DURATION_CHANGED, this._triggerDurationChangeEvent, this);
            }
            _addEventListener(target, type, callback, context) {
                var listener;
                listener = {
                    target: target,
                    type: type,
                    callback: callback,
                    context: context,
                    listener: callback.bind(context)
                };
                target.addEventListener(type, listener.listener);
                this._eventListeners.push(listener);
            }
            _removeAllEventListeners() {
                while (this._eventListeners.length > 0) {
                    this._removeEventListener(this._eventListeners[0]);
                }
                this._eventListeners = [];
            }
            _removeEventListener(listener) {
                var index;
                listener.target.removeEventListener(listener.type, listener.listener);
                index = _.findIndex(this._eventListeners, function (registeredListener) {
                    return registeredListener.target === listener.target && registeredListener.type === listener.type && registeredListener.callback === listener.callback && registeredListener.context === listener.context;
                });
                if (index !== -1) {
                    this._eventListeners.splice(index, 1);
                }
            }
            _onPlayerStateChanged() {
                var states = chrome.cast.media.PlayerState, playerState = this._remotePlayer.playerState;
                if (playerState === states.PLAYING) {
                    this._hasPlayedCurrentItem = true;
                    this.trigger("play");
                    this.trigger("playing");
                } else if (playerState === states.PAUSED) {
                    this.trigger("pause");
                } else if (playerState === states.IDLE && this.ended() || playerState === null && this._hasPlayedCurrentItem) {
                    this._hasPlayedCurrentItem = false;
                    this._closeSessionOnTimeout();
                    this.trigger("ended");
                    this._triggerTimeUpdateEvent();
                } else if (playerState === states.BUFFERING) {
                    this.trigger("waiting");
                }
            }
            _closeSessionOnTimeout() {
                this._clearSessionTimeout();
                this._sessionTimeoutID = setTimeout(function () {
                    var castSession = this._getCastSession();
                    if (castSession) {
                        castSession.endSession(true);
                    }
                    this._clearSessionTimeout();
                }.bind(this), SESSION_TIMEOUT);
            }
            _clearSessionTimeout() {
                if (this._sessionTimeoutID) {
                    clearTimeout(this._sessionTimeoutID);
                    this._sessionTimeoutID = false;
                }
            }
            _getCastContext() {
                return this._chromecastSessionManager.getCastContext();
            }
            _getCastSession() {
                return this._getCastContext().getCurrentSession();
            }
            _getMediaSession() {
                var castSession = this._getCastSession();
                return castSession ? castSession.getMediaSession() : null;
            }
            _triggerVolumeChangeEvent() {
                this.trigger("volumechange");
            }
            _triggerTimeUpdateEvent() {
                this.trigger("timeupdate");
            }
            _triggerDurationChangeEvent() {
                this.trigger("durationchange");
            }
            _triggerErrorEvent() {
                this.trigger("error");
            }
        };
        module.exports = function (videojs) {
            ChromecastTech.canPlaySource = ChromecastSessionManager.isChromecastConnected.bind(ChromecastSessionManager);
            ChromecastTech.isSupported = ChromecastSessionManager.isChromecastConnected.bind(ChromecastSessionManager);
            ChromecastTech.prototype.featuresVolumeControl = true;
            ChromecastTech.prototype.featuresPlaybackRate = false;
            ChromecastTech.prototype.movingMediaElementInDOM = false;
            ChromecastTech.prototype.featuresFullscreenResize = true;
            ChromecastTech.prototype.featuresTimeupdateEvents = true;
            ChromecastTech.prototype.featuresProgressEvents = false;
            ChromecastTech.prototype.featuresNativeTextTracks = false;
            ChromecastTech.prototype.featuresNativeAudioTracks = false;
            ChromecastTech.prototype.featuresNativeVideoTracks = false;
            ChromecastTech.prototype.videojs = videojs;
            videojs.registerTech("chromecast", ChromecastTech);
        };
    }, {
        "../chromecast/ChromecastSessionManager": 4,
        "./ChromecastTechUI": 11,
        underscore: 2
    }],
    11: [function (require, module, exports) {
        "use strict";
        var Class = require("class.extend"), ChromecastTechUI;
        ChromecastTechUI = Class.extend({
            init: function () {
                this._el = this._createDOMElement();
            },
            _createDOMElement: function () {
                var el = this._createElement("div", "vjs-tech vjs-tech-chromecast"), posterContainerEl = this._createElement("div", "vjs-tech-chromecast-poster"), posterImageEl = this._createElement("img", "vjs-tech-chromecast-poster-img"), titleEl = this._createElement("div", "vjs-tech-chromecast-title"), subtitleEl = this._createElement("div", "vjs-tech-chromecast-subtitle"), titleContainer = this._createElement("div", "vjs-tech-chromecast-title-container");
                posterContainerEl.appendChild(posterImageEl);
                titleContainer.appendChild(titleEl);
                titleContainer.appendChild(subtitleEl);
                el.appendChild(titleContainer);
                el.appendChild(posterContainerEl);
                return el;
            },
            _createElement: function (type, className) {
                var el = document.createElement(type);
                el.className = className;
                return el;
            },
            getDOMElement: function () {
                return this._el;
            },
            _findPosterEl: function () {
                return this._el.querySelector(".vjs-tech-chromecast-poster");
            },
            _findPosterImageEl: function () {
                return this._el.querySelector(".vjs-tech-chromecast-poster-img");
            },
            _findTitleEl: function () {
                return this._el.querySelector(".vjs-tech-chromecast-title");
            },
            _findSubtitleEl: function () {
                return this._el.querySelector(".vjs-tech-chromecast-subtitle");
            },
            updatePoster: function (poster) {
                var posterImageEl = this._findPosterImageEl();
                this._poster = poster ? poster : null;
                if (poster) {
                    posterImageEl.setAttribute("src", poster);
                    posterImageEl.classList.remove("vjs-tech-chromecast-poster-img-empty");
                } else {
                    posterImageEl.removeAttribute("src");
                    posterImageEl.classList.add("vjs-tech-chromecast-poster-img-empty");
                }
            },
            getPoster: function () {
                return this._poster;
            },
            updateTitle: function (title) {
                var titleEl = this._findTitleEl();
                this._title = title;
                if (title) {
                    titleEl.innerHTML = title;
                    titleEl.classList.remove("vjs-tech-chromecast-title-empty");
                } else {
                    titleEl.classList.add("vjs-tech-chromecast-title-empty");
                }
            },
            updateSubtitle: function (subtitle) {
                var subtitleEl = this._findSubtitleEl();
                this._subtitle = subtitle;
                if (subtitle) {
                    subtitleEl.innerHTML = subtitle;
                    subtitleEl.classList.remove("vjs-tech-chromecast-subtitle-empty");
                } else {
                    subtitleEl.classList.add("vjs-tech-chromecast-subtitle-empty");
                }
            }
        });
        module.exports = ChromecastTechUI;
    }, {
        "class.extend": 1
    }]
}, {}, [9]);