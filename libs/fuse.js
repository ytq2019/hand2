var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

!function(e, t) {
    "object" == ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "object" == ("undefined" == typeof module ? "undefined" : _typeof(module)) ? module.exports = t() : "function" == typeof define && define.amd ? define("Fuse", [], t) : "object" == ("undefined" == typeof exports ? "undefined" : _typeof(exports)) ? exports.Fuse = t() : e.Fuse = t();
}(void 0, function() {
    return o = {}, r.m = n = [ function(e, t) {
        e.exports = function(e) {
            return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e);
        };
    }, function(e, t, n) {
        function h(e) {
            return (h = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(e) {
                return void 0 === e ? "undefined" : _typeof(e);
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : void 0 === e ? "undefined" : _typeof(e);
            })(e);
        }
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
                Object.defineProperty(e, o.key, o);
            }
        }
        var i = n(2), S = n(8), C = n(0), n = (o(b.prototype, [ {
            key: "setCollection",
            value: function(e) {
                return this.list = e;
            }
        }, {
            key: "search",
            value: function(e) {
                var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {
                    limit: !1
                };
                this._log('---------\nSearch pattern: "'.concat(e, '"'));
                var n = this._prepareSearchers(e), e = n.tokenSearchers, n = n.fullSearcher, e = this._search(e, n), n = e.weights, e = e.results;
                return this._computeScore(n, e), this.options.shouldSort && this._sort(e), t.limit && "number" == typeof t.limit && (e = e.slice(0, t.limit)), 
                this._format(e);
            }
        }, {
            key: "_prepareSearchers",
            value: function() {
                var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", t = [];
                if (this.options.tokenize) for (var n = e.split(this.options.tokenSeparator), o = 0, r = n.length; o < r; o += 1) t.push(new i(n[o], this.options));
                return {
                    tokenSearchers: t,
                    fullSearcher: new i(e, this.options)
                };
            }
        }, {
            key: "_search",
            value: function() {
                var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : [], t = 1 < arguments.length ? arguments[1] : void 0, n = this.list, o = {}, r = [];
                if ("string" == typeof n[0]) {
                    for (var i = 0, a = n.length; i < a; i += 1) this._analyze({
                        key: "",
                        value: n[i],
                        record: i,
                        index: i
                    }, {
                        resultMap: o,
                        results: r,
                        tokenSearchers: e,
                        fullSearcher: t
                    });
                    return {
                        weights: null,
                        results: r
                    };
                }
                for (var s = {}, c = 0, l = n.length; c < l; c += 1) for (var h = n[c], u = 0, f = this.options.keys.length; u < f; u += 1) {
                    var d = this.options.keys[u];
                    if ("string" != typeof d) {
                        if (s[d.name] = {
                            weight: 1 - d.weight || 1
                        }, d.weight <= 0 || 1 < d.weight) throw new Error("Key weight has to be > 0 and <= 1");
                        d = d.name;
                    } else s[d] = {
                        weight: 1
                    };
                    this._analyze({
                        key: d,
                        value: this.options.getFn(h, d),
                        record: h,
                        index: c
                    }, {
                        resultMap: o,
                        results: r,
                        tokenSearchers: e,
                        fullSearcher: t
                    });
                }
                return {
                    weights: s,
                    results: r
                };
            }
        }, {
            key: "_analyze",
            value: function(e, t) {
                var n = e.key, o = e.arrayIndex, r = void 0 === o ? -1 : o, i = e.value, a = e.record, s = e.index, o = t.tokenSearchers, c = void 0 === o ? [] : o, e = t.fullSearcher, l = void 0 === e ? [] : e, o = t.resultMap, h = void 0 === o ? {} : o, e = t.results, u = void 0 === e ? [] : e;
                if (null != i) {
                    var f = !1, d = -1, p = 0;
                    if ("string" == typeof i) {
                        this._log("\nKey: ".concat("" === n ? "-" : n));
                        o = l.search(i);
                        if (this._log('Full text: "'.concat(i, '", score: ').concat(o.score)), this.options.tokenize) {
                            for (var v = i.split(this.options.tokenSeparator), y = [], g = 0; g < c.length; g += 1) {
                                var m = c[g];
                                this._log('\nPattern: "'.concat(m.pattern, '"'));
                                for (var S = !1, b = 0; b < v.length; b += 1) {
                                    var k = v[b], x = m.search(k), _ = {};
                                    x.isMatch ? (_[k] = x.score, S = f = !0, y.push(x.score)) : (_[k] = 1, this.options.matchAllTokens || y.push(1)), 
                                    this._log('Token: "'.concat(k, '", score: ').concat(_[k]));
                                }
                                S && (p += 1);
                            }
                            d = y[0];
                            for (var M = y.length, L = 1; L < M; L += 1) d += y[L];
                            d /= M, this._log("Token score average:", d);
                        }
                        t = o.score;
                        -1 < d && (t = (t + d) / 2), this._log("Score average:", t);
                        e = !this.options.tokenize || !this.options.matchAllTokens || p >= c.length;
                        this._log("\nCheck Matches: ".concat(e)), (f || o.isMatch) && e && ((e = h[s]) ? e.output.push({
                            key: n,
                            arrayIndex: r,
                            value: i,
                            score: t,
                            matchedIndices: o.matchedIndices
                        }) : (h[s] = {
                            item: a,
                            output: [ {
                                key: n,
                                arrayIndex: r,
                                value: i,
                                score: t,
                                matchedIndices: o.matchedIndices
                            } ]
                        }, u.push(h[s])));
                    } else if (C(i)) for (var w = 0, A = i.length; w < A; w += 1) this._analyze({
                        key: n,
                        arrayIndex: w,
                        value: i[w],
                        record: a,
                        index: s
                    }, {
                        resultMap: h,
                        results: u,
                        tokenSearchers: c,
                        fullSearcher: l
                    });
                }
            }
        }, {
            key: "_computeScore",
            value: function(e, t) {
                this._log("\n\nComputing score:\n");
                for (var n = 0, o = t.length; n < o; n += 1) {
                    for (var r = t[n].output, i = r.length, a = 1, s = 1, c = 0; c < i; c += 1) {
                        var l = e ? e[r[c].key].weight : 1, h = (1 === l ? r[c].score : r[c].score || .001) * l;
                        1 !== l ? s = Math.min(s, h) : a *= r[c].nScore = h;
                    }
                    t[n].score = 1 === s ? a : s, this._log(t[n]);
                }
            }
        }, {
            key: "_sort",
            value: function(e) {
                this._log("\n\nSorting...."), e.sort(this.options.sortFn);
            }
        }, {
            key: "_format",
            value: function(e) {
                var n, t = [];
                this.options.verbose && (n = [], this._log("\n\nOutput:\n\n", JSON.stringify(e, function(e, t) {
                    if ("object" === h(t) && null !== t) {
                        if (-1 !== n.indexOf(t)) return;
                        n.push(t);
                    }
                    return t;
                })), n = null);
                var o = [];
                this.options.includeMatches && o.push(function(e, t) {
                    var n = e.output;
                    t.matches = [];
                    for (var o = 0, r = n.length; o < r; o += 1) {
                        var i, a = n[o];
                        0 !== a.matchedIndices.length && (i = {
                            indices: a.matchedIndices,
                            value: a.value
                        }, a.key && (i.key = a.key), a.hasOwnProperty("arrayIndex") && -1 < a.arrayIndex && (i.arrayIndex = a.arrayIndex), 
                        t.matches.push(i));
                    }
                }), this.options.includeScore && o.push(function(e, t) {
                    t.score = e.score;
                });
                for (var r = 0, i = e.length; r < i; r += 1) {
                    var a = e[r];
                    if (this.options.id && (a.item = this.options.getFn(a.item, this.options.id)[0]), 
                    o.length) {
                        for (var s = {
                            item: a.item
                        }, c = 0, l = o.length; c < l; c += 1) o[c](a, s);
                        t.push(s);
                    } else t.push(a.item);
                }
                return t;
            }
        }, {
            key: "_log",
            value: function() {
                var e;
                this.options.verbose && (e = console).log.apply(e, arguments);
            }
        } ]), b);
        function b(e, t) {
            var n = t.location, o = void 0 === n ? 0 : n, r = t.distance, i = void 0 === r ? 100 : r, a = t.threshold, s = void 0 === a ? .6 : a, c = t.maxPatternLength, l = void 0 === c ? 32 : c, h = t.caseSensitive, u = void 0 !== h && h, f = t.tokenSeparator, d = void 0 === f ? / +/g : f, p = t.findAllMatches, v = void 0 !== p && p, y = t.minMatchCharLength, g = void 0 === y ? 1 : y, m = t.id, n = void 0 === m ? null : m, r = t.keys, a = void 0 === r ? [] : r, c = t.shouldSort, h = void 0 === c || c, f = t.getFn, p = void 0 === f ? S : f, y = t.sortFn, m = void 0 === y ? function(e, t) {
                return e.score - t.score;
            } : y, r = t.tokenize, c = void 0 !== r && r, f = t.matchAllTokens, y = void 0 !== f && f, r = t.includeMatches, f = void 0 !== r && r, r = t.includeScore, r = void 0 !== r && r, t = t.verbose, t = void 0 !== t && t;
            !function(e) {
                if (!(e instanceof b)) throw new TypeError("Cannot call a class as a function");
            }(this), this.options = {
                location: o,
                distance: i,
                threshold: s,
                maxPatternLength: l,
                isCaseSensitive: u,
                tokenSeparator: d,
                findAllMatches: v,
                minMatchCharLength: g,
                id: n,
                keys: a,
                includeMatches: f,
                includeScore: r,
                shouldSort: h,
                getFn: p,
                sortFn: m,
                verbose: t,
                tokenize: c,
                matchAllTokens: y
            }, this.setCollection(e);
        }
        e.exports = n;
    }, function(e, t, n) {
        function o(e, t) {
            for (var n = 0; n < t.length; n++) {
                var o = t[n];
                o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), 
                Object.defineProperty(e, o.key, o);
            }
        }
        var a = n(3), s = n(4), l = n(7), n = (o(h.prototype, [ {
            key: "search",
            value: function(e) {
                if (this.options.isCaseSensitive || (e = e.toLowerCase()), this.pattern === e) return {
                    isMatch: !0,
                    score: 0,
                    matchedIndices: [ [ 0, e.length - 1 ] ]
                };
                var t = this.options, n = t.maxPatternLength, o = t.tokenSeparator;
                if (this.pattern.length > n) return a(e, this.pattern, o);
                var r = this.options, i = r.location, t = r.distance, n = r.threshold, o = r.findAllMatches, r = r.minMatchCharLength;
                return s(e, this.pattern, this.patternAlphabet, {
                    location: i,
                    distance: t,
                    threshold: n,
                    findAllMatches: o,
                    minMatchCharLength: r
                });
            }
        } ]), h);
        function h(e, t) {
            var n = t.location, o = void 0 === n ? 0 : n, r = t.distance, i = void 0 === r ? 100 : r, a = t.threshold, s = void 0 === a ? .6 : a, c = t.maxPatternLength, n = void 0 === c ? 32 : c, r = t.isCaseSensitive, a = void 0 !== r && r, c = t.tokenSeparator, r = void 0 === c ? / +/g : c, c = t.findAllMatches, c = void 0 !== c && c, t = t.minMatchCharLength, t = void 0 === t ? 1 : t;
            !function(e) {
                if (!(e instanceof h)) throw new TypeError("Cannot call a class as a function");
            }(this), this.options = {
                location: o,
                distance: i,
                threshold: s,
                maxPatternLength: n,
                isCaseSensitive: a,
                tokenSeparator: r,
                findAllMatches: c,
                minMatchCharLength: t
            }, this.pattern = this.options.isCaseSensitive ? e : e.toLowerCase(), this.pattern.length <= n && (this.patternAlphabet = l(this.pattern));
        }
        e.exports = n;
    }, function(e, t) {
        var c = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
        e.exports = function(e, t) {
            var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : / +/g, n = new RegExp(t.replace(c, "\\$&").replace(n, "|")), o = e.match(n), n = !!o, r = [];
            if (n) for (var i = 0, a = o.length; i < a; i += 1) {
                var s = o[i];
                r.push([ e.indexOf(s), s.length - 1 ]);
            }
            return {
                score: n ? .5 : 1,
                isMatch: n,
                matchedIndices: r
            };
        };
    }, function(e, t, n) {
        var I = n(5), O = n(6);
        e.exports = function(e, t, n, o) {
            for (var r = o.location, i = void 0 === r ? 0 : r, a = o.distance, s = void 0 === a ? 100 : a, r = o.threshold, a = void 0 === r ? .6 : r, r = o.findAllMatches, c = void 0 !== r && r, o = o.minMatchCharLength, o = void 0 === o ? 1 : o, l = i, h = e.length, u = a, f = e.indexOf(t, l), d = t.length, p = [], v = 0; v < h; v += 1) p[v] = 0;
            -1 !== f && (a = I(t, {
                errors: 0,
                currentLocation: f,
                expectedLocation: l,
                distance: s
            }), u = Math.min(a, u), -1 !== (f = e.lastIndexOf(t, l + d)) && (a = I(t, {
                errors: 0,
                currentLocation: f,
                expectedLocation: l,
                distance: s
            }), u = Math.min(a, u))), f = -1;
            for (var y = [], g = 1, m = d + h, S = 1 << (d <= 31 ? d - 1 : 30), b = 0; b < d; b += 1) {
                for (var k = 0, x = m; k < x; ) I(t, {
                    errors: b,
                    currentLocation: l + x,
                    expectedLocation: l,
                    distance: s
                }) <= u ? k = x : m = x, x = Math.floor((m - k) / 2 + k);
                m = x;
                var _ = Math.max(1, l - x + 1), M = c ? h : Math.min(l + x, h) + d, L = Array(M + 2);
                L[M + 1] = (1 << b) - 1;
                for (var w = M; _ <= w; --w) {
                    var A = w - 1, C = n[e.charAt(A)];
                    if (C && (p[A] = 1), L[w] = (L[w + 1] << 1 | 1) & C, 0 !== b && (L[w] |= (y[w + 1] | y[w]) << 1 | 1 | y[w + 1]), 
                    L[w] & S && (g = I(t, {
                        errors: b,
                        currentLocation: A,
                        expectedLocation: l,
                        distance: s
                    })) <= u) {
                        if (u = g, (f = A) <= l) break;
                        _ = Math.max(1, 2 * l - f);
                    }
                }
                if (I(t, {
                    errors: b + 1,
                    currentLocation: l,
                    expectedLocation: l,
                    distance: s
                }) > u) break;
                y = L;
            }
            return {
                isMatch: 0 <= f,
                score: 0 === g ? .001 : g,
                matchedIndices: O(p, o)
            };
        };
    }, function(e, t) {
        e.exports = function(e, t) {
            var n = t.errors, o = void 0 === n ? 0 : n, r = t.currentLocation, n = void 0 === r ? 0 : r, r = t.expectedLocation, r = void 0 === r ? 0 : r, t = t.distance, t = void 0 === t ? 100 : t, e = o / e.length, n = Math.abs(r - n);
            return t ? e + n / t : n ? 1 : e;
        };
    }, function(e, t) {
        e.exports = function() {
            for (var e, t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : [], n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 1, o = [], r = -1, i = 0, a = t.length; i < a; i += 1) {
                var s = t[i];
                s && -1 === r ? r = i : s || -1 === r || ((e = i - 1) - r + 1 >= n && o.push([ r, e ]), 
                r = -1);
            }
            return t[i - 1] && n <= i - r && o.push([ r, i - 1 ]), o;
        };
    }, function(e, t) {
        e.exports = function(e) {
            for (var t = {}, n = e.length, o = 0; o < n; o += 1) t[e.charAt(o)] = 0;
            for (var r = 0; r < n; r += 1) t[e.charAt(r)] |= 1 << n - r - 1;
            return t;
        };
    }, function(e, t, n) {
        var h = n(0);
        e.exports = function(e, t) {
            return function e(t, n, o) {
                if (n) {
                    var r = n.indexOf("."), i = n, a = null;
                    -1 !== r && (i = n.slice(0, r), a = n.slice(r + 1));
                    var s = t[i];
                    if (null != s) if (a || "string" != typeof s && "number" != typeof s) if (h(s)) for (var c = 0, l = s.length; c < l; c += 1) e(s[c], a, o); else a && e(s, a, o); else o.push(s.toString());
                } else o.push(t);
                return o;
            }(e, t, []);
        };
    } ], r.c = o, r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        });
    }, r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, r.t = function(t, e) {
        if (1 & e && (t = r(t)), 8 & e) return t;
        if (4 & e && "object" == (void 0 === t ? "undefined" : _typeof(t)) && t && t.__esModule) return t;
        var n = Object.create(null);
        if (r.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t) for (var o in t) r.d(n, o, function(e) {
            return t[e];
        }.bind(null, o));
        return n;
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return r.d(t, "a", t), t;
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 1);
    function r(e) {
        if (o[e]) return o[e].exports;
        var t = o[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return n[e].call(t.exports, t, t.exports, r), t.l = !0, t.exports;
    }
    var n, o;
});