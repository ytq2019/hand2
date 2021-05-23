var app = getApp();

Page({
    data: {
        appInfo: app.globalData.appInfo,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        Loading: !0,
        Page: 1,
        Messages: []
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        this.setData({
            ThemeStyle: app.getThemeStyle(),
            Type: a.type,
            Title: "system" == a.type ? "系统通知" : "交易信息"
        }), this.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/chatroom",
            data: {
                m: "superman_hand2",
                act: t.data.Type,
                page: t.data.Page
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
        var t = this.data.Messages;
        void 0 !== a.messages && (t = t.concat(a.messages)), this.setData({
            Loading: !1,
            Messages: t,
            Gone: void 0 !== a.messages && !a.messages.length
        });
    },
    onPullDownRefresh: function() {
        this.getIndexData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function(a) {
        var t = this;
        t.data.Gone || (t.setData({
            Page: t.data.Page + 1,
            Paging: !0
        }), t.getIndexData());
    },
    toPage: function(a) {
        a = a.currentTarget.dataset.url;
        a && wx.navigateTo({
            url: a + "&type=redirect"
        });
    }
});