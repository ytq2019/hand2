var __assign = function() {
    return (__assign = Object.assign || function(t) {
        for (var n, e = 1, o = arguments.length; e < o; e++) for (var s in n = arguments[e]) Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
        return t;
    }).apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var queue = [], defaultOptions = {
    show: !1,
    title: "",
    width: null,
    message: "",
    messageRichText: !1,
    selector: "#dialog",
    className: "",
    asyncClose: !1,
    transition: "scale",
    customStyle: "",
    messageAlign: "",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    showConfirmButton: !0,
    showCancelButton: !1,
    confirmButtonOpenType: "",
    confirmButtonColor: "bg-orange",
    cancelButtonColor: "bg-grey"
}, currentOptions = __assign({}, defaultOptions);

function getContext() {
    var t = getCurrentPages();
    return t[t.length - 1];
}

var Dialog = function(o) {
    return o = __assign(__assign({}, currentOptions), o), new Promise(function(t, n) {
        var e = (o.context || getContext()).selectComponent(o.selector);
        delete o.context, delete o.selector, e ? (e.setData(__assign({
            onCancel: n,
            onConfirm: t
        }, o)), wx.nextTick(function() {
            e.setData({
                show: !0
            });
        }), queue.push(e)) : console.warn("未找到 dialog 节点，请确认 selector 及 context 是否正确");
    });
};

Dialog.alert = function(t) {
    return Dialog(t);
}, Dialog.confirm = function(t) {
    return Dialog(__assign({
        showCancelButton: !0
    }, t));
}, Dialog.close = function() {
    queue.forEach(function(t) {
        t.close();
    }), queue = [];
}, Dialog.stopLoading = function() {
    queue.forEach(function(t) {
        t.stopLoading();
    });
}, Dialog.currentOptions = currentOptions, Dialog.defaultOptions = defaultOptions, 
Dialog.setDefaultOptions = function(t) {
    currentOptions = __assign(__assign({}, currentOptions), t), Dialog.currentOptions = currentOptions;
}, Dialog.resetDefaultOptions = function() {
    currentOptions = __assign({}, defaultOptions), Dialog.currentOptions = currentOptions;
}, Dialog.resetDefaultOptions(), exports.default = Dialog;