function _toConsumableArray(r) {
    if (Array.isArray(r)) {
        for (var n = 0, e = Array(r.length); n < r.length; n++) e[n] = r[n];
        return e;
    }
    return Array.from(r);
}

function extractComponentId() {
    return ((0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}).currentTarget || {}).dataset.componentId;
}

var LIFE_CYCLE = [ "onLoad", "onReady", "onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", "onShareAppMessage", "onPageScroll" ], extendCreator = function() {
    var r = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, n = r.life, n = void 0 === n ? LIFE_CYCLE : n, r = r.exclude, r = void 0 === r ? [] : r, u = r.concat(LIFE_CYCLE.map(getFuncArrayName));
    if (!Array.isArray(n) || !Array.isArray(r)) throw new Error("Invalid Extend Config");
    var i = n.filter(function(r) {
        return 0 <= LIFE_CYCLE.indexOf(r);
    });
    return function(a) {
        for (var r = arguments.length, n = Array(1 < r ? r - 1 : 0), e = 1; e < r; e++) n[e - 1] = arguments[e];
        return n.forEach(function(t) {
            t && Object.keys(t).forEach(function(r) {
                var o, n, e = t[r];
                0 <= u.indexOf(r) || (0 <= i.indexOf(r) && "function" == typeof e ? (o = getFuncArrayName(r), 
                a[o] || (a[o] = [], a[r] && a[o].push(a[r]), a[r] = function() {
                    for (var n = this, r = arguments.length, e = Array(r), t = 0; t < r; t++) e[t] = arguments[t];
                    a[o].forEach(function(r) {
                        return r.apply(n, e);
                    });
                }), t[o] ? (n = a[o]).push.apply(n, _toConsumableArray(t[o])) : a[o].push(e)) : a[r] = e);
            });
        }), a;
    };
}, getFuncArrayName = function(r) {
    return "__$" + r;
};

module.exports = {
    extractComponentId: extractComponentId,
    extend: Object.assign,
    extendCreator: extendCreator
};