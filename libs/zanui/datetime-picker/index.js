var _createClass = function() {
    function n(t, e) {
        for (var a = 0; a < e.length; a++) {
            var n = e[a];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), 
            Object.defineProperty(t, n.key, n);
        }
    }
    return function(t, e, a) {
        return e && n(t.prototype, e), a && n(t, a), t;
    };
}(), _slicedToArray = function(t, e) {
    if (Array.isArray(t)) return t;
    if (Symbol.iterator in Object(t)) return function(t, e) {
        var a = [], n = !0, i = !1, s = void 0;
        try {
            for (var r, o = t[Symbol.iterator](); !(n = (r = o.next()).done) && (a.push(r.value), 
            !e || a.length !== e); n = !0) ;
        } catch (t) {
            i = !0, s = t;
        } finally {
            try {
                !n && o.return && o.return();
            } finally {
                if (i) throw s;
            }
        }
        return a;
    }(t, e);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
};

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}

function partStartWithZero(t, e) {
    for (var a = ""; a.length < e; ) a += "0";
    return (a + t).slice(-e);
}

function genNumber(t, e, a) {
    for (var n = []; t <= e; ) n.push(partStartWithZero(t, a)), t++;
    return n;
}

function moment(a) {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "YYYY:MM:DD";
    if (a || 0 === a || (a = new Date()), "Invalid Date" === (a = new Date(a)).toString()) throw new Error("Invalid Date");
    function e(t, e) {
        return e ? e(a["get" + t]()) : a["get" + t]();
    }
    var n = new Map();
    n.set(/(Y+)/i, function() {
        return e("FullYear", function(t) {
            return (t + "").substr(4 - RegExp.$1.length);
        });
    }), n.set(/(M+)/, function() {
        return e("Month", function(t) {
            return partStartWithZero(t + 1, RegExp.$1.length);
        });
    }), n.set(/(D+)/i, function() {
        return e("Date", function(t) {
            return partStartWithZero(t, RegExp.$1.length);
        });
    }), n.set(/(H+)/i, function() {
        return e("Hours", function(t) {
            return partStartWithZero(t, RegExp.$1.length);
        });
    }), n.set(/(m+)/, function() {
        return e("Minutes", function(t) {
            return partStartWithZero(t, RegExp.$1.length);
        });
    }), n.set(/(s+)/, function() {
        return e("Seconds", function(t) {
            return partStartWithZero(t, RegExp.$1.length);
        });
    });
    var i = !0, s = !1, r = void 0;
    try {
        for (var o = n[Symbol.iterator](); !(i = (h = o.next()).done); i = !0) {
            var u = _slicedToArray(h.value, 2), h = u[0], u = u[1];
            h.test(t) && (t = t.replace(RegExp.$1, u.call(null)));
        }
    } catch (t) {
        s = !0, r = t;
    } finally {
        try {
            !i && o.return && o.return();
        } finally {
            if (s) throw r;
        }
    }
    return t;
}

var LIMIT_YEAR_COUNT = 50, DatePicker = function() {
    function n(t) {
        var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : new Date(), a = arguments[2];
        _classCallCheck(this, n), this.types = [ "year", "month", "day", "hour", "minute", "second" ], 
        this.months = genNumber(1, 12, 2), this.hours = genNumber(0, 23, 2), this.seconds = genNumber(0, 59, 2), 
        this.minutes = genNumber(0, 59, 2), this.init(e, a);
    }
    return _createClass(n, [ {
        key: "getYears",
        value: function(t) {
            var e = Math.floor(LIMIT_YEAR_COUNT / 2);
            return genNumber(t - e, t + (LIMIT_YEAR_COUNT - e), 4);
        }
    }, {
        key: "lastDay",
        value: function(t, e) {
            return 12 !== e ? new Date(new Date(t + "/" + (e + 1) + "/1").getTime() - 864e5).getDate() : 31;
        }
    }, {
        key: "init",
        value: function(t, e) {
            var a = new Date(t), n = a.getFullYear(), i = a.getMonth() + 1, t = this.getYears(n), n = genNumber(1, this.lastDay(n, i), 2);
            this._years = t, this._dataList = [ t, this.months, n, this.hours, this.minutes, this.seconds ], 
            this._indexs = [ 25, i - 1, a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds() ], 
            e && e({
                dataList: this._dataList,
                indexs: this._indexs
            });
        }
    }, {
        key: "update",
        value: function(t, e, a) {
            switch (this.types[t]) {
              case "year":
                this._updateYear(t, e, a);
                break;

              case "month":
                this._updateMonth(t, e, a);
                break;

              default:
                this._indexs[t] = e, a && a({
                    dataList: this._dataList,
                    indexs: this._indexs,
                    updateColumn: t,
                    updateIndex: e
                });
            }
        }
    }, {
        key: "_updateYear",
        value: function(t, e, a) {
            e = this._dataList[t][e];
            this._dataList[t] = this.getYears(+e), this._indexs[t] = Math.floor(LIMIT_YEAR_COUNT / 2), 
            a && a({
                dataList: this._dataList,
                indexs: this._indexs,
                updateColumn: t
            });
        }
    }, {
        key: "_updateMonth",
        value: function(t, e, a) {
            var n = this._dataList[t][e], i = this._dataList[0][this._indexs[0]], n = this.lastDay(+i, +n);
            this._indexs[t] = e, this._dataList[2] = genNumber(1, n, 2), this._indexs[2] = this._indexs[2] >= this._dataList[2].length ? this._dataList[2].length - 1 : this._indexs[2], 
            a && a({
                dataList: this._dataList,
                indexs: this._indexs,
                updateColumn: 2,
                updateIndex: this._indexs[2]
            }), a && a({
                dataList: this._dataList,
                indexs: this._indexs,
                updateColumn: 1,
                updateIndex: e
            });
        }
    } ]), n;
}(), _indexs = [];

Component({
    properties: {
        placeholder: {
            type: String,
            value: "请选择时间"
        },
        format: {
            type: String,
            value: "YYYY-MM-DD HH:mm:ss"
        },
        native: {
            type: Boolean
        },
        pickerView: {
            type: Boolean
        },
        date: {
            type: String,
            value: new Date()
        },
        notUse: {
            type: Array
        }
    },
    externalClasses: [ "placeholder-class" ],
    data: {
        transPos: [ 0, 0, 0, 0, 0, 0 ]
    },
    attached: function() {
        var e = this;
        this.use = {}, [ "years", "months", "days", "hours", "minutes", "seconds" ].forEach(function(t) {
            -1 === (e.data.notUse || []).indexOf(t) && (e.use[t] = !0);
        }), this.setData({
            use: this.use
        }), this.data.pickerView && !this.data.native && this.showPicker();
    },
    ready: function() {
        this.setData({
            dataList: [ [ "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043" ], genNumber(1, 12, 2), genNumber(0, 31, 2), genNumber(0, 23, 2), genNumber(0, 59, 2), genNumber(0, 59, 2) ]
        }), this.picker = new DatePicker(this.data.format, this.data.date, this.updatePicker.bind(this));
    },
    methods: {
        updatePicker: function(t) {
            var e = t.dataList, a = t.indexs, n = t.updateColumn, t = t.updateIndex, i = {};
            _indexs = a, n && (i["transPos[" + n + "]"] = -36 * _indexs[n], i["dataList[" + n + "]"] = e[n]), 
            void 0 !== t && (i["transPos[" + n + "]"] = -36 * _indexs[n], i["selected[" + n + "]"] = a[n]), 
            n || void 0 !== t || (i = {
                dataList: e,
                selected: a
            }, _indexs.forEach(function(t, e) {
                i["transPos[" + e + "]"] = 36 * -t;
            })), this.setData(i);
        },
        touchmove: function(t) {
            var e = t.changedTouches, a = t.target.dataset.col, n = e[0].clientY;
            a && (t = {}, e = this.data.dataList[a].length, t["transPos[" + a + "]"] = this.startTransPos + (n - this.startY), 
            0 <= t["transPos[" + a + "]"] ? t["transPos[" + a + "]"] = 0 : 36 * -(e - 1) >= t["transPos[" + a + "]"] && (t["transPos[" + a + "]"] = 36 * -(e - 1)), 
            this.setData(t));
        },
        touchStart: function(t) {
            var e = t.target, a = t.changedTouches, e = e.dataset.col, a = a[0];
            e && (this.startY = a.clientY, this.startTime = t.timeStamp, this.startTransPos = this.data.transPos[e]);
        },
        touchEnd: function(t) {
            var e = t.target.dataset.col;
            e && (t = this.data.transPos[e], t = Math.round(t / 36), this.columnchange({
                detail: {
                    column: +e,
                    value: -t
                }
            }));
        },
        columnchange: function(t) {
            var e = t.detail, t = e.column, e = e.value;
            _indexs[t] = e, this.picker.update(t, e, this.updatePicker.bind(this)), this.data.pickerView && !this.data.native && this.change({
                detail: {
                    value: _indexs
                }
            });
        },
        getFormatStr: function() {
            var n = this, i = new Date();
            return [ "FullYear", "Month", "Date", "Hours", "Minutes", "Seconds" ].forEach(function(t, e) {
                var a = n.data.dataList[e][_indexs[e]];
                "Month" === t && (a = +n.data.dataList[e][_indexs[e]] - 1), i["set" + t](+a);
            }), moment(i, this.data.format);
        },
        showPicker: function() {
            this.setData({
                show: !0
            });
        },
        hidePicker: function(t) {
            t = t.currentTarget.dataset.action;
            this.setData({
                show: !1
            }), "cancel" === t ? this.cancel({
                detail: {}
            }) : this.change({
                detail: {
                    value: _indexs
                }
            });
        },
        change: function(t) {
            var a = t.detail.value, t = this.data.dataList.map(function(t, e) {
                return +t[a[e]];
            });
            if (this.triggerEvent("change", {
                value: t
            }), this.data.pickerView && this.data.native) for (var e = 0; e < a.length; e++) if (_indexs[e] !== a[e]) {
                this.columnchange({
                    detail: {
                        column: e,
                        value: a[e]
                    }
                });
                break;
            }
            this.setData({
                text: this.getFormatStr()
            });
        },
        cancel: function(t) {
            this.triggerEvent("cancel", t.detail);
        }
    }
});