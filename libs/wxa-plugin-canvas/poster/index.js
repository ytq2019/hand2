Component({
    properties: {
        config: {
            type: Object,
            value: {}
        },
        preload: {
            type: Boolean,
            value: !1
        },
        hideLoading: {
            type: Boolean,
            value: !1
        }
    },
    ready: function() {
        var t, o = this;
        this.data.preload && (t = this.selectComponent("#poster"), this.downloadStatus = "doing", 
        t.downloadResource(this.data.config).then(function() {
            o.downloadStatus = "success", o.trigger("downloadSuccess");
        }).catch(function(t) {
            o.downloadStatus = "fail", o.trigger("downloadFail", t);
        }));
    },
    methods: {
        trigger: function(t, o) {
            this.listener && "function" == typeof this.listener[t] && this.listener[t](o);
        },
        once: function(t, o) {
            void 0 === this.listener && (this.listener = {}), this.listener[t] = o;
        },
        downloadResource: function(n) {
            var i = this;
            return new Promise(function(t, o) {
                n && (i.downloadStatus = null);
                var e = i.selectComponent("#poster");
                i.downloadStatus && "fail" !== i.downloadStatus ? "success" === i.downloadStatus ? t() : (i.once("downloadSuccess", function() {
                    return t();
                }), i.once("downloadFail", function(t) {
                    return o(t);
                })) : e.downloadResource(i.data.config).then(function() {
                    i.downloadStatus = "success", t();
                }).catch(function(t) {
                    return o(t);
                });
            });
        },
        onCreate: function() {
            var o = this, t = 0 < arguments.length && void 0 !== arguments[0] && arguments[0];
            return this.data.hideLoading || wx.showLoading({
                mask: !0,
                title: "生成中"
            }), this.downloadResource("boolean" == typeof t && t).then(function() {
                o.selectComponent("#poster").create(o.data.config);
            }).catch(function(t) {
                o.data.hideLoading || wx.hideLoading(), wx.showToast({
                    icon: "none",
                    title: t.errMsg || "生成失败"
                }), console.error(t), o.triggerEvent("fail", t);
            });
        },
        onCreateSuccess: function(t) {
            t = t.detail;
            this.triggerEvent("success", t);
        },
        onCreateFail: function(t) {
            console.error(t), this.triggerEvent("fail", t);
        }
    }
});