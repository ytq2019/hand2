var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        Loading: !0,
        noticeInfo: null
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle(),
            noticeId: void 0 !== a.id ? a.id : 0
        }), this.getIndexData(), app.viewCount();
    },
    getIndexData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/notice",
            data: {
                m: "superman_hand2",
                act: "detail",
                id: t.data.noticeId
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                t.setData({
                    Loading: !1,
                    noticeInfo: a.notice_info
                });
            },
            fail: function(a) {
                console.log(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    }
});