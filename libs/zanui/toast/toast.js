var _extends = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var o, a = arguments[e];
        for (o in a) Object.prototype.hasOwnProperty.call(a, o) && (t[o] = a[o]);
    }
    return t;
};

function _defineProperty(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t;
}

var TOAST_CONFIG_KEY = "zanui.__zanToastPageConfig", timeoutData = {
    timeoutId: 0,
    toastCtx: null
}, globalToastUserConfig = {};

function getPageCtx(t) {
    var e = t;
    return e || (e = (t = getCurrentPages())[t.length - 1]), e;
}

function getPageToastConfig(t) {
    return (t.data.zanui || {}).__zanToastPageConfig || {};
}

function Toast(t, e) {
    var o = t || {};
    "string" == typeof t && (o = {
        message: t
    });
    var t = getPageCtx(e), e = getPageToastConfig(t), o = _extends({}, globalToastUserConfig, e, o), a = t.selectComponent(o.selector);
    a ? (timeoutData.timeoutId && Toast.clear(), a.show(_extends({}, o, {
        show: !0
    })), o = setTimeout(function() {
        a.clear();
    }, o.timeout || 3e3), timeoutData = {
        timeoutId: o,
        toastCtx: a
    }) : console.error("无法找到对应的toast组件，请于页面中注册并在 wxml 中声明 toast 自定义组件");
}

Toast.setDefaultOptions = function() {
    var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "page", t = {
        selector: t.selector || "",
        type: t.type || "",
        icon: t.icon || "",
        image: t.image || "",
        timeout: t.timeout || 3e3
    };
    "global" === e ? globalToastUserConfig = _extends({}, t) : "page" === e && getPageCtx().setData(_defineProperty({}, "" + TOAST_CONFIG_KEY, t));
}, Toast.resetDefaultOptions = function() {
    "global" === (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "page") ? globalToastUserConfig = {} : getPageCtx().setData(_defineProperty({}, "" + TOAST_CONFIG_KEY, {}));
}, Toast.clear = function() {
    clearTimeout(timeoutData.timeoutId);
    try {
        timeoutData.toastCtx && timeoutData.toastCtx.clear();
    } catch (t) {}
    timeoutData = {
        timeoutId: 0,
        toastCtx: null
    };
}, Toast.loading = function() {
    Toast(_extends({}, 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}, {
        type: "loading"
    }));
}, module.exports = Toast;