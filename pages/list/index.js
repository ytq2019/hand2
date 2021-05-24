var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        Page: 1,
        Paging: !1,
        itemList: [],
        itemType: 0,
        showWxad: !0,
        keyword: "",
        showPostButton: !1
    },
    toPage: function(t) {
        app.superman.toPage(t);
    },
    goTop: function(t) {
        app.superman.goTop(t);
    },
    copy: function(t) {
        app.superman.copy(t);
    },
    onLoad: function(t) {
        console.log("onLoad", t);
        this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            AppName: wx.getStorageSync("AppName"),
            ThemeStyle: app.getThemeStyle(),
            itemType: t.type,
            pageTitle: "广场",
            SoldImg: wx.getStorageSync("SoldImg") || app.globalData.AssetsUrl + "/yz.png"
        }), this.getIndexData(), app.viewCount();
    },
    inputKeyword: function(t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    submitSearch: function() {
        this.setData({
            Page: 1,
            Paging: !1,
            itemList: [],
            showWxad: !0
        }), this.getIndexData();
    },
    getIndexData: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/list",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                t = t.data.data;
                a.setData({
                    Setting: t.setting
                }), a.getItemList();
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    getItemList: function() {
        var o = this;
        app.util.request({
            url: "entry/wxapp/list",
            data: {
                m: "superman_hand2",
                act: "post",
                op: "list",
                page: o.data.Page,
                type: o.data.itemType,
                keyword: o.data.keyword
            },
            showLoading: !0,
            success: function(t) {
                console.log(t);
                for (var a = t.data.data.list, e = 0; e < a.length; e++) a[e]._price = app.formatPrice(a[e], o.data.Setting.currency_info.symbol);
                o.setData({
                    Loading: !1,
                    Paging: !1,
                    itemList: a.length ? o.data.itemList.concat(a) : o.data.itemList,
                    Gone: !(a.length && 10 <= a.length)
                });
            },
            fail: function(t) {
                console.error(t), app.util.message(t.data.errmsg, "", "error");
            }
        });
    },
    onPullDownRefresh: function() {
        this.setData({
            Page: 1,
            Paging: !1,
            itemList: [],
            showWxad: !0
        }), this.getIndexData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function(t) {
        var a = this;
        a.data.Gone || (a.setData({
            Page: a.data.Page + 1,
            Paging: !0
        }), a.getIndexData());
    },
    onPageScroll: function(t) {
        this.setData({
            showGoTop: 500 <= t.scrollTop
        });
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.pageTitle + (t.data.AppName ? "-" + t.data.AppName : ""),
            path: "/pages/home/index?redirect=" + encodeURIComponent("/pages/list/index?type=" + t.data.itemType)
        };
    },
    onShareTimeline: function() {
        var t = this;
        return {
            title: t.data.pageTitle + (t.data.AppName ? "-" + t.data.AppName : ""),
            query: "type=" + t.data.itemType + "&share=timeline"
        };
    },
    WxadError: function(t) {
        console.error("WxadError", t), this.setData({
            showWxad: !1
        });
    },
    readyFootnav: function(t) {
        var a = t.detail.footnav;
        if (a.length) {
            for (var e = !1, o = 0; o < a.length; o++) if ("发布" == a[o].title && "" == a[o].url) {
                e = !0;
                break;
            }
            e || this.setData({
                showPostButton: !0
            });
        }
    }
});