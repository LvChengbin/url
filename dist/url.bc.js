(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.URL = {})));
}(this, (function (exports) { 'use strict';

var isString = (function (str) {
  return typeof str === 'string' || str instanceof String;
});

var isUrl = (function (url) {
    if (!isString(url)) return false;
    if (!/^(https?|ftp):\/\//i.test(url)) return false;
    var a = document.createElement('a');
    a.href = url;
    return (/^(https?|ftp):/i.test(a.protocol)
    );
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

function supportIterator() {
    try {
        return !!Symbol.iterator;
    } catch (e) {
        return false;
    }
}

var decode = function decode(str) {
    return decodeURIComponent(String(str).replace(/\+/g, ' '));
};

var URLSearchParams = function () {
    function URLSearchParams(init) {
        classCallCheck(this, URLSearchParams);

        if (window.URLSearchParams) {
            return new window.URLSearchParams(init);
        } else {
            this.dict = [];

            if (!init) return;

            if (URLSearchParams.prototype.isPrototypeOf(init)) {
                return new URLSearchParams(init.toString());
            }

            if (Array.isArray(init)) {
                throw new TypeError('Failed to construct "URLSearchParams": The provided value cannot be converted to a sequence.');
            }

            if (typeof init === 'string') {
                if (init.charAt(0) === '?') {
                    init = init.slice(1);
                }
                var pairs = init.split(/&+/);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        var index = item.indexOf('=');
                        this.append(index > -1 ? item.slice(0, index) : item, index > -1 ? item.slice(index + 1) : '');
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return;
            }

            for (var attr in init) {
                this.append(attr, init[attr]);
            }
        }
    }

    createClass(URLSearchParams, [{
        key: 'append',
        value: function append(name, value) {
            this.dict.push([decode(name), decode(value)]);
        }
    }, {
        key: 'delete',
        value: function _delete(name) {
            var dict = this.dict;
            for (var i = 0, l = dict.length; i < l; i += 1) {
                if (dict[i][0] == name) {
                    dict.splice(i, 1);
                    i--;l--;
                }
            }
        }
    }, {
        key: 'get',
        value: function get$$1(name) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.dict[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var item = _step2.value;

                    if (item[0] == name) {
                        return item[1];
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return null;
        }
    }, {
        key: 'getAll',
        value: function getAll(name) {
            var res = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.dict[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var item = _step3.value;

                    if (item[0] == name) {
                        res.push(item[1]);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return res;
        }
    }, {
        key: 'has',
        value: function has(name) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.dict[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var item = _step4.value;

                    if (item[0] == name) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return false;
        }
    }, {
        key: 'set',
        value: function set$$1(name, value) {
            var set$$1 = false;
            for (var i = 0, l = this.dict.length; i < l; i += 1) {
                var item = this.dict[i];
                if (item[0] == name) {
                    if (set$$1) {
                        this.dict.splice(i, 1);
                        i--;l--;
                    } else {
                        item[1] = String(value);
                        set$$1 = true;
                    }
                }
            }
        }
    }, {
        key: 'sort',
        value: function sort() {
            this.dict.sort(function (a, b) {
                var nameA = a[0].toLowerCase();
                var nameB = b[0].toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
        }
    }, {
        key: 'entries',
        value: function entries() {

            var dict = [];

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.dict[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var item = _step5.value;

                    dict.push([item[0], item[1]]);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return !supportIterator() ? dict : defineProperty({}, Symbol.iterator, function () {
                return {
                    next: function next() {
                        var value = dict.shift();
                        return {
                            done: value === undefined,
                            value: value
                        };
                    }
                };
            });
        }
    }, {
        key: 'keys',
        value: function keys() {
            var keys = [];
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.dict[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var item = _step6.value;

                    keys.push(item[0]);
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return !supportIterator() ? keys : defineProperty({}, Symbol.iterator, function () {
                return {
                    next: function next() {
                        var value = keys.shift();
                        return {
                            done: value === undefined,
                            value: value
                        };
                    }
                };
            });
        }
    }, {
        key: 'values',
        value: function values() {
            var values = [];
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.dict[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var item = _step7.value;

                    values.push(item[1]);
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            return !supportIterator() ? values : defineProperty({}, Symbol.iterator, function () {
                return {
                    next: function next() {
                        var value = values.shift();
                        return {
                            done: value === undefined,
                            value: value
                        };
                    }
                };
            });
        }
    }, {
        key: 'toString',
        value: function toString() {
            var pairs = [];
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.dict[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var item = _step8.value;

                    pairs.push(encodeURIComponent(item[0]) + '=' + encodeURIComponent(item[1]));
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            return pairs.join('&');
        }
    }]);
    return URLSearchParams;
}();

var attrs = ['href', 'origin', 'host', 'hash', 'hostname', 'pathname', 'port', 'protocol', 'search', 'username', 'password', 'searchParams'];

var URL = function () {
    function URL(path, base) {
        classCallCheck(this, URL);

        if (window.URL) {
            var url = new window.URL(path, base);
            if (!('searchParams' in url)) {
                url.searchParams = new URLSearchParams(url.search);
            }
            return url;
        } else {

            if (URL.prototype.isPrototypeOf(path)) {
                return new URL(path.href);
            }

            if (URL.prototype.isPrototypeOf(base)) {
                return new URL(path, base.href);
            }

            path = String(path);

            if (base !== undefined) {
                if (!isUrl(base)) {
                    throw new TypeError('Failed to construct "URL": Invalid base URL');
                }
                if (/^[a-zA-Z][0-9a-zA-Z.-]*:/.test(path)) {
                    base = null;
                }
            } else {
                if (!/^[a-zA-Z][0-9a-zA-Z.-]*:/.test(path)) {
                    throw new TypeError('Failed to construct "URL": Invalid URL');
                }
            }

            if (base) {
                base = new URL(base);
                if (path.charAt(0) === '/' && path.charAt(1) === '/') {
                    path = base.protocol + path;
                } else if (path.charAt(0) === '/') {
                    path = base.origin + path;
                } else {
                    var pathname = base.pathname;

                    if (pathname.charAt(pathname.length - 1) === '/') {
                        path = base.origin + pathname + path;
                    } else {
                        path = base.origin + pathname.replace(/\/[^/]+\/?$/, '') + '/' + path;
                    }
                }
            }

            var dotdot = /([^/])\/[^/]+\/\.\.\//;
            var dot = /\/\.\//g;

            path = path.replace(dot, '/');

            while (path.match(dotdot)) {
                path = path.replace(dotdot, '$1/');
            }

            var node = document.createElement('a');
            node.href = path;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = attrs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var attr = _step.value;

                    this[attr] = attr in node ? node[attr] : '';
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.searchParams = new URLSearchParams(this.search);
        }
    }

    createClass(URL, [{
        key: 'toString',
        value: function toString() {
            return this.href;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.href;
        }
    }]);
    return URL;
}();

exports.URL = URL;
exports.URLSearchParams = URLSearchParams;

Object.defineProperty(exports, '__esModule', { value: true });

})));
