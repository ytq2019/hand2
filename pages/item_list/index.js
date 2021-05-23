var app = getApp(), Toast = require("../../libs/zanui/toast/toast");

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        Page: 1,
        Paging: !1,
        List: []
    },
    onLoad: function(t) {
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle(),
            type: t.type,
            title: 1 == t.type ? "得到的赞" : "我的收藏"
        }), this.getItemList(), app.viewCount();
    },
    toPage: function(t) {
        app.superman.toPage(t);
    },
    getItemList: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "item_list",
                type: e.data.type,
                page: e.data.Page
            },
            success: function(t) {
                var a = t.data.data, t = e.data.List;
                a.list && (t = t.concat(a.list)), e.setData({
                    Loading: !1,
                    Paging: !1,
                    List: t,
                    Gone: !a.list.length
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    onReachBottom: function(t) {
        var a = this;
        a.data.Gone || (a.setData({
            Page: a.data.Page + 1,
            Paging: !0
        }), a.getItemList());
    }
});