var _extends = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var o, n = arguments[e];
        for (o in n) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
    }
    return t;
}, defaultData = require("./data");

function Dialog(t, e) {
    var o = _extends({}, defaultData, t), t = e;
    t || (t = (e = getCurrentPages())[e.length - 1]);
    var n = t.selectComponent(o.selector);
    if (!n) return console.error("无法找到对应的dialog组件，请于页面中注册并在 wxml 中声明 dialog 自定义组件"), 
    Promise.reject({
        type: "component error"
    });
    var t = o.buttons, r = void 0 === t ? [] : t, a = !1;
    return 0 === r.length ? (o.showConfirmButton && r.push({
        type: "confirm",
        text: o.confirmButtonText,
        color: o.confirmButtonColor
    }), o.showCancelButton && (t = {
        type: "cancel",
        text: o.cancelButtonText,
        color: o.cancelButtonColor
    }, o.buttonsShowVertical ? r.push(t) : r.unshift(t))) : a = !0, new Promise(function(t, e) {
        n.setData(_extends({}, o, {
            buttons: r,
            showCustomBtns: a,
            key: "" + new Date().getTime(),
            show: !0,
            promiseFunc: {
                resolve: t,
                reject: e
            }
        }));
    });
}

module.exports = Dialog;