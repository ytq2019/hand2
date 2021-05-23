var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
    return typeof n;
} : function(n) {
    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
};

(function() {
    function t() {}
    function s(n) {
        return n instanceof s ? n : this instanceof s ? void (this._wrapped = n) : new s(n);
    }
    var e = Array.prototype, o = Object.prototype, n = Function.prototype, u = e.push, c = e.slice, l = o.toString, r = o.hasOwnProperty, i = Array.isArray, a = Object.keys, f = n.bind, p = Object.create;
    (module.exports = s).VERSION = "1.8.2";
    function h(u, i, n) {
        if (void 0 === i) return u;
        switch (null == n ? 3 : n) {
          case 1:
            return function(n) {
                return u.call(i, n);
            };

          case 2:
            return function(n, t) {
                return u.call(i, n, t);
            };

          case 3:
            return function(n, t, r) {
                return u.call(i, n, t, r);
            };

          case 4:
            return function(n, t, r, e) {
                return u.call(i, n, t, r, e);
            };
        }
        return function() {
            return u.apply(i, arguments);
        };
    }
    function v(n, t, r) {
        return null == n ? s.identity : s.isFunction(n) ? h(n, t, r) : s.isObject(n) ? s.matcher(n) : s.property(n);
    }
    s.iteratee = function(n, t) {
        return v(n, t, 1 / 0);
    };
    function y(n) {
        return s.isObject(n) ? p ? p(n) : (t.prototype = n, n = new t(), t.prototype = null, 
        n) : {};
    }
    function d(n) {
        return "number" == typeof (n = null != n && n.length) && 0 <= n && n <= m;
    }
    var g = function(a, f) {
        return function(n) {
            var t = arguments.length;
            if (t < 2 || null == n) return n;
            for (var r = 1; r < t; r++) for (var e = arguments[r], u = a(e), i = u.length, o = 0; o < i; o++) {
                var c = u[o];
                f && void 0 !== n[c] || (n[c] = e[c]);
            }
            return n;
        };
    }, m = Math.pow(2, 53) - 1;
    function b(c) {
        return function(n, t, r, e) {
            t = h(t, e, 4);
            var u = !d(n) && s.keys(n), i = (u || n).length, e = 0 < c ? 0 : i - 1;
            return arguments.length < 3 && (r = n[u ? u[e] : e], e += c), function(n, t, r, e, u, i) {
                for (;0 <= u && u < i; u += c) {
                    var o = e ? e[u] : u;
                    r = t(r, n[o], o, n);
                }
                return r;
            }(n, t, r, u, e, i);
        };
    }
    s.each = s.forEach = function(n, t, r) {
        if (t = h(t, r), d(n)) for (u = 0, i = n.length; u < i; u++) t(n[u], u, n); else for (var e = s.keys(n), u = 0, i = e.length; u < i; u++) t(n[e[u]], e[u], n);
        return n;
    }, s.map = s.collect = function(n, t, r) {
        t = v(t, r);
        for (var e = !d(n) && s.keys(n), u = (e || n).length, i = Array(u), o = 0; o < u; o++) {
            var c = e ? e[o] : o;
            i[o] = t(n[c], c, n);
        }
        return i;
    }, s.reduce = s.foldl = s.inject = b(1), s.reduceRight = s.foldr = b(-1), s.find = s.detect = function(n, t, r) {
        r = d(n) ? s.findIndex(n, t, r) : s.findKey(n, t, r);
        if (void 0 !== r && -1 !== r) return n[r];
    }, s.filter = s.select = function(n, e, t) {
        var u = [];
        return e = v(e, t), s.each(n, function(n, t, r) {
            e(n, t, r) && u.push(n);
        }), u;
    }, s.reject = function(n, t, r) {
        return s.filter(n, s.negate(v(t)), r);
    }, s.every = s.all = function(n, t, r) {
        t = v(t, r);
        for (var e = !d(n) && s.keys(n), u = (e || n).length, i = 0; i < u; i++) {
            var o = e ? e[i] : i;
            if (!t(n[o], o, n)) return !1;
        }
        return !0;
    }, s.some = s.any = function(n, t, r) {
        t = v(t, r);
        for (var e = !d(n) && s.keys(n), u = (e || n).length, i = 0; i < u; i++) {
            var o = e ? e[i] : i;
            if (t(n[o], o, n)) return !0;
        }
        return !1;
    }, s.contains = s.includes = s.include = function(n, t, r) {
        return d(n) || (n = s.values(n)), 0 <= s.indexOf(n, t, "number" == typeof r && r);
    }, s.invoke = function(n, r) {
        var e = c.call(arguments, 2), u = s.isFunction(r);
        return s.map(n, function(n) {
            var t = u ? r : n[r];
            return null == t ? t : t.apply(n, e);
        });
    }, s.pluck = function(n, t) {
        return s.map(n, s.property(t));
    }, s.where = function(n, t) {
        return s.filter(n, s.matcher(t));
    }, s.findWhere = function(n, t) {
        return s.find(n, s.matcher(t));
    }, s.max = function(n, e, t) {
        var r, u, i = -1 / 0, o = -1 / 0;
        if (null == e && null != n) for (var c = 0, a = (n = d(n) ? n : s.values(n)).length; c < a; c++) r = n[c], 
        i < r && (i = r); else e = v(e, t), s.each(n, function(n, t, r) {
            u = e(n, t, r), (o < u || u === -1 / 0 && i === -1 / 0) && (i = n, o = u);
        });
        return i;
    }, s.min = function(n, e, t) {
        var r, u, i = 1 / 0, o = 1 / 0;
        if (null == e && null != n) for (var c = 0, a = (n = d(n) ? n : s.values(n)).length; c < a; c++) (r = n[c]) < i && (i = r); else e = v(e, t), 
        s.each(n, function(n, t, r) {
            ((u = e(n, t, r)) < o || u === 1 / 0 && i === 1 / 0) && (i = n, o = u);
        });
        return i;
    }, s.shuffle = function(n) {
        for (var t, r = d(n) ? n : s.values(n), e = r.length, u = Array(e), i = 0; i < e; i++) (t = s.random(0, i)) !== i && (u[i] = u[t]), 
        u[t] = r[i];
        return u;
    }, s.sample = function(n, t, r) {
        return null == t || r ? (d(n) || (n = s.values(n)), n[s.random(n.length - 1)]) : s.shuffle(n).slice(0, Math.max(0, t));
    }, s.sortBy = function(n, e, t) {
        return e = v(e, t), s.pluck(s.map(n, function(n, t, r) {
            return {
                value: n,
                index: t,
                criteria: e(n, t, r)
            };
        }).sort(function(n, t) {
            var r = n.criteria, e = t.criteria;
            if (r !== e) {
                if (e < r || void 0 === r) return 1;
                if (r < e || void 0 === e) return -1;
            }
            return n.index - t.index;
        }), "value");
    };
    n = function(i) {
        return function(r, e, n) {
            var u = {};
            return e = v(e, n), s.each(r, function(n, t) {
                t = e(n, t, r);
                i(u, n, t);
            }), u;
        };
    };
    s.groupBy = n(function(n, t, r) {
        s.has(n, r) ? n[r].push(t) : n[r] = [ t ];
    }), s.indexBy = n(function(n, t, r) {
        n[r] = t;
    }), s.countBy = n(function(n, t, r) {
        s.has(n, r) ? n[r]++ : n[r] = 1;
    }), s.toArray = function(n) {
        return n ? s.isArray(n) ? c.call(n) : d(n) ? s.map(n, s.identity) : s.values(n) : [];
    }, s.size = function(n) {
        return null == n ? 0 : (d(n) ? n : s.keys(n)).length;
    }, s.partition = function(n, e, t) {
        e = v(e, t);
        var u = [], i = [];
        return s.each(n, function(n, t, r) {
            (e(n, t, r) ? u : i).push(n);
        }), [ u, i ];
    }, s.first = s.head = s.take = function(n, t, r) {
        if (null != n) return null == t || r ? n[0] : s.initial(n, n.length - t);
    }, s.initial = function(n, t, r) {
        return c.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)));
    }, s.last = function(n, t, r) {
        if (null != n) return null == t || r ? n[n.length - 1] : s.rest(n, Math.max(0, n.length - t));
    }, s.rest = s.tail = s.drop = function(n, t, r) {
        return c.call(n, null == t || r ? 1 : t);
    }, s.compact = function(n) {
        return s.filter(n, s.identity);
    };
    function _(n, t, r, e) {
        for (var u = [], i = 0, o = e || 0, c = n && n.length; o < c; o++) {
            var a = n[o];
            if (d(a) && (s.isArray(a) || s.isArguments(a))) {
                t || (a = _(a, t, r));
                var f = 0, l = a.length;
                for (u.length += l; f < l; ) u[i++] = a[f++];
            } else r || (u[i++] = a);
        }
        return u;
    }
    function j(i) {
        return function(n, t, r) {
            t = v(t, r);
            for (var e = null != n && n.length, u = 0 < i ? 0 : e - 1; 0 <= u && u < e; u += i) if (t(n[u], u, n)) return u;
            return -1;
        };
    }
    s.flatten = function(n, t) {
        return _(n, t, !1);
    }, s.without = function(n) {
        return s.difference(n, c.call(arguments, 1));
    }, s.uniq = s.unique = function(n, t, r, e) {
        if (null == n) return [];
        s.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = v(r, e));
        for (var u = [], i = [], o = 0, c = n.length; o < c; o++) {
            var a = n[o], f = r ? r(a, o, n) : a;
            t ? (o && i === f || u.push(a), i = f) : r ? s.contains(i, f) || (i.push(f), u.push(a)) : s.contains(u, a) || u.push(a);
        }
        return u;
    }, s.union = function() {
        return s.uniq(_(arguments, !0, !0));
    }, s.intersection = function(n) {
        if (null == n) return [];
        for (var t = [], r = arguments.length, e = 0, u = n.length; e < u; e++) {
            var i = n[e];
            if (!s.contains(t, i)) {
                for (var o = 1; o < r && s.contains(arguments[o], i); o++) ;
                o === r && t.push(i);
            }
        }
        return t;
    }, s.difference = function(n) {
        var t = _(arguments, !0, !0, 1);
        return s.filter(n, function(n) {
            return !s.contains(t, n);
        });
    }, s.zip = function() {
        return s.unzip(arguments);
    }, s.unzip = function(n) {
        for (var t = n && s.max(n, "length").length || 0, r = Array(t), e = 0; e < t; e++) r[e] = s.pluck(n, e);
        return r;
    }, s.object = function(n, t) {
        for (var r = {}, e = 0, u = n && n.length; e < u; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
        return r;
    }, s.indexOf = function(n, t, r) {
        var e = 0, u = n && n.length;
        if ("number" == typeof r) e = r < 0 ? Math.max(0, u + r) : r; else if (r && u) return n[e = s.sortedIndex(n, t)] === t ? e : -1;
        if (t != t) return s.findIndex(c.call(n, e), s.isNaN);
        for (;e < u; e++) if (n[e] === t) return e;
        return -1;
    }, s.lastIndexOf = function(n, t, r) {
        var e = n ? n.length : 0;
        if ("number" == typeof r && (e = r < 0 ? e + r + 1 : Math.min(e, r + 1)), t != t) return s.findLastIndex(c.call(n, 0, e), s.isNaN);
        for (;0 <= --e; ) if (n[e] === t) return e;
        return -1;
    }, s.findIndex = j(1), s.findLastIndex = j(-1), s.sortedIndex = function(n, t, r, e) {
        for (var u = (r = v(r, e, 1))(t), i = 0, o = n.length; i < o; ) {
            var c = Math.floor((i + o) / 2);
            r(n[c]) < u ? i = c + 1 : o = c;
        }
        return i;
    }, s.range = function(n, t, r) {
        arguments.length <= 1 && (t = n || 0, n = 0), r = r || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; i < e; i++, 
        n += r) u[i] = n;
        return u;
    };
    function x(n, t, r, e, u) {
        return e instanceof t ? (r = y(n.prototype), u = n.apply(r, u), s.isObject(u) ? u : r) : n.apply(r, u);
    }
    s.bind = function(t, r) {
        if (f && t.bind === f) return f.apply(t, c.call(arguments, 1));
        if (!s.isFunction(t)) throw new TypeError("Bind must be called on a function");
        var e = c.call(arguments, 2);
        return function n() {
            return x(t, n, r, this, e.concat(c.call(arguments)));
        };
    }, s.partial = function(i) {
        var o = c.call(arguments, 1);
        return function n() {
            for (var t = 0, r = o.length, e = Array(r), u = 0; u < r; u++) e[u] = o[u] === s ? arguments[t++] : o[u];
            for (;t < arguments.length; ) e.push(arguments[t++]);
            return x(i, n, this, this, e);
        };
    }, s.bindAll = function(n) {
        var t, r, e = arguments.length;
        if (e <= 1) throw new Error("bindAll must be passed function names");
        for (t = 1; t < e; t++) n[r = arguments[t]] = s.bind(n[r], n);
        return n;
    }, s.memoize = function(r, e) {
        function u(n) {
            var t = u.cache, n = "" + (e ? e.apply(this, arguments) : n);
            return s.has(t, n) || (t[n] = r.apply(this, arguments)), t[n];
        }
        return u.cache = {}, u;
    }, s.defer = s.partial(s.delay = function(n, t) {
        var r = c.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r);
        }, t);
    }, s, 1), s.throttle = function(r, e, u) {
        var i, o, c, a = null, f = 0;
        u = u || {};
        function l() {
            f = !1 === u.leading ? 0 : s.now(), a = null, c = r.apply(i, o), a || (i = o = null);
        }
        return function() {
            var n = s.now();
            f || !1 !== u.leading || (f = n);
            var t = e - (n - f);
            return i = this, o = arguments, t <= 0 || e < t ? (a && (clearTimeout(a), a = null), 
            f = n, c = r.apply(i, o), a || (i = o = null)) : a || !1 === u.trailing || (a = setTimeout(l, t)), 
            c;
        };
    }, s.debounce = function(t, r, e) {
        function u() {
            var n = s.now() - a;
            n < r && 0 <= n ? i = setTimeout(u, r - n) : (i = null, e || (f = t.apply(c, o), 
            i || (c = o = null)));
        }
        var i, o, c, a, f;
        return function() {
            c = this, o = arguments, a = s.now();
            var n = e && !i;
            return i = i || setTimeout(u, r), n && (f = t.apply(c, o), c = o = null), f;
        };
    }, s.wrap = function(n, t) {
        return s.partial(t, n);
    }, s.negate = function(n) {
        return function() {
            return !n.apply(this, arguments);
        };
    }, s.compose = function() {
        var r = arguments, e = r.length - 1;
        return function() {
            for (var n = e, t = r[e].apply(this, arguments); n--; ) t = r[n].call(this, t);
            return t;
        };
    }, s.after = function(n, t) {
        return function() {
            if (--n < 1) return t.apply(this, arguments);
        };
    }, s.once = s.partial(s.before = function(n, t) {
        var r;
        return function() {
            return 0 < --n && (r = t.apply(this, arguments)), n <= 1 && (t = null), r;
        };
    }, 2);
    var w = !{
        toString: null
    }.propertyIsEnumerable("toString"), A = [ "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString" ];
    function O(n, t) {
        var r = A.length, e = n.constructor, u = s.isFunction(e) && e.prototype || o, i = "constructor";
        for (s.has(n, i) && !s.contains(t, i) && t.push(i); r--; ) (i = A[r]) in n && n[i] !== u[i] && !s.contains(t, i) && t.push(i);
    }
    s.keys = function(n) {
        if (!s.isObject(n)) return [];
        if (a) return a(n);
        var t, r = [];
        for (t in n) s.has(n, t) && r.push(t);
        return w && O(n, r), r;
    }, s.allKeys = function(n) {
        if (!s.isObject(n)) return [];
        var t, r = [];
        for (t in n) r.push(t);
        return w && O(n, r), r;
    }, s.values = function(n) {
        for (var t = s.keys(n), r = t.length, e = Array(r), u = 0; u < r; u++) e[u] = n[t[u]];
        return e;
    }, s.mapObject = function(n, t, r) {
        t = v(t, r);
        for (var e, u = s.keys(n), i = u.length, o = {}, c = 0; c < i; c++) o[e = u[c]] = t(n[e], e, n);
        return o;
    }, s.pairs = function(n) {
        for (var t = s.keys(n), r = t.length, e = Array(r), u = 0; u < r; u++) e[u] = [ t[u], n[t[u]] ];
        return e;
    }, s.invert = function(n) {
        for (var t = {}, r = s.keys(n), e = 0, u = r.length; e < u; e++) t[n[r[e]]] = r[e];
        return t;
    }, s.functions = s.methods = function(n) {
        var t, r = [];
        for (t in n) s.isFunction(n[t]) && r.push(t);
        return r.sort();
    }, s.extend = g(s.allKeys), s.extendOwn = s.assign = g(s.keys), s.findKey = function(n, t, r) {
        t = v(t, r);
        for (var e, u = s.keys(n), i = 0, o = u.length; i < o; i++) if (t(n[e = u[i]], e, n)) return e;
    }, s.pick = function(n, t, r) {
        var e, u, i = {}, o = n;
        if (null == o) return i;
        s.isFunction(t) ? (u = s.allKeys(o), e = h(t, r)) : (u = _(arguments, !1, !1, 1), 
        e = function(n, t, r) {
            return t in r;
        }, o = Object(o));
        for (var c = 0, a = u.length; c < a; c++) {
            var f = u[c], l = o[f];
            e(l, f, o) && (i[f] = l);
        }
        return i;
    }, s.omit = function(n, t, r) {
        var e;
        return t = s.isFunction(t) ? s.negate(t) : (e = s.map(_(arguments, !1, !1, 1), String), 
        function(n, t) {
            return !s.contains(e, t);
        }), s.pick(n, t, r);
    }, s.defaults = g(s.allKeys, !0), s.create = function(n, t) {
        n = y(n);
        return t && s.extendOwn(n, t), n;
    }, s.clone = function(n) {
        return s.isObject(n) ? s.isArray(n) ? n.slice() : s.extend({}, n) : n;
    }, s.tap = function(n, t) {
        return t(n), n;
    }, s.isMatch = function(n, t) {
        var r = s.keys(t), e = r.length;
        if (null == n) return !e;
        for (var u = Object(n), i = 0; i < e; i++) {
            var o = r[i];
            if (t[o] !== u[o] || !(o in u)) return !1;
        }
        return !0;
    };
    function k(n, t, r, e) {
        if (n === t) return 0 !== n || 1 / n == 1 / t;
        if (null == n || null == t) return n === t;
        if (n instanceof s && (n = n._wrapped), t instanceof s && (t = t._wrapped), (o = l.call(n)) !== l.call(t)) return !1;
        switch (o) {
          case "[object RegExp]":
          case "[object String]":
            return "" + n == "" + t;

          case "[object Number]":
            return +n != +n ? +t != +t : 0 == +n ? 1 / +n == 1 / t : +n == +t;

          case "[object Date]":
          case "[object Boolean]":
            return +n == +t;
        }
        var u = "[object Array]" === o;
        if (!u) {
            if ("object" != (void 0 === n ? "undefined" : _typeof(n)) || "object" != (void 0 === t ? "undefined" : _typeof(t))) return !1;
            var i = n.constructor, o = t.constructor;
            if (i !== o && !(s.isFunction(i) && i instanceof i && s.isFunction(o) && o instanceof o) && "constructor" in n && "constructor" in t) return !1;
        }
        e = e || [];
        for (var c = (r = r || []).length; c--; ) if (r[c] === n) return e[c] === t;
        if (r.push(n), e.push(t), u) {
            if ((c = n.length) !== t.length) return !1;
            for (;c--; ) if (!k(n[c], t[c], r, e)) return !1;
        } else {
            var a, f = s.keys(n), c = f.length;
            if (s.keys(t).length !== c) return !1;
            for (;c--; ) if (a = f[c], !s.has(t, a) || !k(n[a], t[a], r, e)) return !1;
        }
        return r.pop(), e.pop(), !0;
    }
    s.isEqual = function(n, t) {
        return k(n, t);
    }, s.isEmpty = function(n) {
        return null == n || (d(n) && (s.isArray(n) || s.isString(n) || s.isArguments(n)) ? 0 === n.length : 0 === s.keys(n).length);
    }, s.isElement = function(n) {
        return !(!n || 1 !== n.nodeType);
    }, s.isArray = i || function(n) {
        return "[object Array]" === l.call(n);
    }, s.isObject = function(n) {
        var t = void 0 === n ? "undefined" : _typeof(n);
        return "function" === t || "object" === t && !!n;
    }, s.each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Error" ], function(t) {
        s["is" + t] = function(n) {
            return l.call(n) === "[object " + t + "]";
        };
    }), s.isArguments(arguments) || (s.isArguments = function(n) {
        return s.has(n, "callee");
    }), "function" != typeof /./ && "object" != ("undefined" == typeof Int8Array ? "undefined" : _typeof(Int8Array)) && (s.isFunction = function(n) {
        return "function" == typeof n || !1;
    }), s.isFinite = function(n) {
        return isFinite(n) && !isNaN(parseFloat(n));
    }, s.isNaN = function(n) {
        return s.isNumber(n) && n !== +n;
    }, s.isBoolean = function(n) {
        return !0 === n || !1 === n || "[object Boolean]" === l.call(n);
    }, s.isNull = function(n) {
        return null === n;
    }, s.isUndefined = function(n) {
        return void 0 === n;
    }, s.has = function(n, t) {
        return null != n && r.call(n, t);
    }, s.noConflict = function() {
        return root._ = previousUnderscore, this;
    }, s.identity = function(n) {
        return n;
    }, s.constant = function(n) {
        return function() {
            return n;
        };
    }, s.noop = function() {}, s.property = function(t) {
        return function(n) {
            return null == n ? void 0 : n[t];
        };
    }, s.propertyOf = function(t) {
        return null == t ? function() {} : function(n) {
            return t[n];
        };
    }, s.matcher = s.matches = function(t) {
        return t = s.extendOwn({}, t), function(n) {
            return s.isMatch(n, t);
        };
    }, s.times = function(n, t, r) {
        var e = Array(Math.max(0, n));
        t = h(t, r, 1);
        for (var u = 0; u < n; u++) e[u] = t(u);
        return e;
    }, s.random = function(n, t) {
        return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1));
    }, s.now = Date.now || function() {
        return new Date().getTime();
    };
    n = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }, g = s.invert(n), i = function(t) {
        function r(n) {
            return t[n];
        }
        var n = "(?:" + s.keys(t).join("|") + ")", e = RegExp(n), u = RegExp(n, "g");
        return function(n) {
            return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, r) : n;
        };
    };
    s.escape = i(n), s.unescape = i(g), s.result = function(n, t, r) {
        t = null == n ? void 0 : n[t];
        return void 0 === t && (t = r), s.isFunction(t) ? t.call(n) : t;
    };
    var S = 0;
    s.uniqueId = function(n) {
        var t = ++S + "";
        return n ? n + t : t;
    }, s.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    function F(n) {
        return "\\" + I[n];
    }
    var E = /(.)^/, I = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, M = /\\|'|\r|\n|\u2028|\u2029/g;
    s.template = function(i, n, t) {
        !n && t && (n = t), n = s.defaults({}, n, s.templateSettings);
        var r = RegExp([ (n.escape || E).source, (n.interpolate || E).source, (n.evaluate || E).source ].join("|") + "|$", "g"), o = 0, c = "__p+='";
        i.replace(r, function(n, t, r, e, u) {
            return c += i.slice(o, u).replace(M, F), o = u + n.length, t ? c += "'+\n((__t=(" + t + "))==null?'':_.escape(__t))+\n'" : r ? c += "'+\n((__t=(" + r + "))==null?'':__t)+\n'" : e && (c += "';\n" + e + "\n__p+='"), 
            n;
        }), c += "';\n", n.variable || (c = "with(obj||{}){\n" + c + "}\n"), c = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + c + "return __p;\n";
        try {
            var e = new Function(n.variable || "obj", "_", c);
        } catch (n) {
            throw n.source = c, n;
        }
        t = function(n) {
            return e.call(this, n, s);
        }, r = n.variable || "obj";
        return t.source = "function(" + r + "){\n" + c + "}", t;
    }, s.chain = function(n) {
        n = s(n);
        return n._chain = !0, n;
    };
    function N(n, t) {
        return n._chain ? s(t).chain() : t;
    }
    (s.mixin = function(r) {
        s.each(s.functions(r), function(n) {
            var t = s[n] = r[n];
            s.prototype[n] = function() {
                var n = [ this._wrapped ];
                return u.apply(n, arguments), N(this, t.apply(s, n));
            };
        });
    })(s), s.each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(t) {
        var r = e[t];
        s.prototype[t] = function() {
            var n = this._wrapped;
            return r.apply(n, arguments), "shift" !== t && "splice" !== t || 0 !== n.length || delete n[0], 
            N(this, n);
        };
    }), s.each([ "concat", "join", "slice" ], function(n) {
        var t = e[n];
        s.prototype[n] = function() {
            return N(this, t.apply(this._wrapped, arguments));
        };
    }), s.prototype.valueOf = s.prototype.toJSON = s.prototype.value = function() {
        return this._wrapped;
    }, s.prototype.toString = function() {
        return "" + this._wrapped;
    };
}).call(void 0);