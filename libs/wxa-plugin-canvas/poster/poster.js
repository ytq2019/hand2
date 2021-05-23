Object.defineProperty(exports, "__esModule", {
    value: !0
});

var _extends = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r, o = arguments[t];
        for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
    }
    return e;
}, defaultOptions = {
    selector: "#poster"
};

function Poster() {
    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, t = arguments[1], e = _extends({}, defaultOptions, e), r = getCurrentPages(), r = r[r.length - 1];
    t && (r = t);
    r = r.selectComponent(e.selector);
    return delete e.selector, r;
}

Poster.create = function() {
    var e = 0 < arguments.length && void 0 !== arguments[0] && arguments[0], t = arguments[1];
    if (Poster({}, t)) return Poster({}, t).onCreate(e);
    console.error('请设置组件的id="poster"!!!');
}, exports.default = Poster;