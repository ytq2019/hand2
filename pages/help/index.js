var app = getApp();

Page({
    data: {
        appInfo: app.globalData.appInfo,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        Loading: !0
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), this.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "help"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a), t.loadPageData(a.data.data);
            },
            fail: function(a) {
                app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    loadPageData: function(a) {
        this.setData({
            Loading: !1,
            Content: void 0 !== a.content ? a.content : ""
        });
    }
});