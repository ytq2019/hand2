var app = getApp();

Component({
    options: {
        addGlobalClass: !0
    },
    properties: {
        themeStyle: {
            type: Object,
            value: null
        }
    },
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        showPostModal: !1,
        Setting: {}
    },
    ready: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/footnav",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !1,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                a.setData({
                    Setting: t.setting,
                    showPost: (t.setting.recycle.open || t.setting.post.open || t.setting.buying.open) && !t.setting.audit.open,
                    currentUrl: app.superman.getCurrentPageUrl(!0)
                }), a.triggerEvent("ready", {
                    footnav: t.setting.footnav
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    methods: {
        click: function(t) {
            var a, e = t.currentTarget.dataset.url;
            e != this.data.currentUrl && (console.log(e, this.data.currentUrl), (a = t.currentTarget.dataset.appid) ? wx.navigateToMiniProgram({
                appId: a,
                path: e,
                success: function(t) {
                    console.info("navigateToMiniProgram success", a, e, t);
                },
                fail: function(t) {
                    console.info("navigateToMiniProgram fail", a, e, t);
                }
            }) : (wx.showLoading(), wx.redirectTo({
                url: e
            })));
        },
        showPostModal: function() {
            this.setData({
                showPostModal: !0
            });
        },
        hidePostModal: function() {
            this.setData({
                showPostModal: !1
            });
        },
        toPage: function(t) {
            app.superman.toPage(t);
        }
    }
});