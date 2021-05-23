var _extends = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var a, o = arguments[e];
        for (a in o) Object.prototype.hasOwnProperty.call(o, a) && (t[a] = o[a]);
    }
    return t;
}, defaultData = require("./data"), _f = function() {};

Component({
    properties: {},
    data: _extends({}, defaultData, {
        key: "",
        show: !1,
        showCustomBtns: !1,
        promiseFunc: {}
    }),
    methods: {
        handleButtonClick: function(t) {
            var e = t.currentTarget, a = (void 0 === e ? {} : e).dataset, t = void 0 === a ? {} : a, e = this.data.promiseFunc || {}, a = e.resolve, a = void 0 === a ? _f : a, e = e.reject, e = void 0 === e ? _f : e;
            this.setData({
                show: !1
            }), this.data.showCustomBtns ? a({
                type: t.type
            }) : "confirm" === t.type ? a({
                type: "confirm"
            }) : e({
                type: "cancel"
            });
        }
    }
});