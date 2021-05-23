var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        itemData: null,
        categoryData: [],
        categoryCur: null
    },
    toPage: function(a) {
        app.superman.toPage(a);
    },
    goTop: function(a) {
        app.superman.goTop(a);
    },
    copy: function(a) {
        app.superman.copy(a);
    },
    onLoad: function(a) {
        console.log("onLoad", a);
        var t = this;
        app.getLocation(), t.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle(),
            itemId: a.id
        }), t.data.userInfo ? (t.getIndexData(), t.getItemData(), t.getCategoryData(), app.viewCount()) : app.util.getUserInfo(function() {
            t.onLoad(a);
        });
    },
    getIndexData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/post",
            data: {
                m: "superman_hand2",
                act: "display"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                a.buying.open ? (t.setData({
                    wxadInfo: a.wxad_info
                }), wx.setStorageSync("ItemRefresh", a.item_refresh)) : wx.redirectTo({
                    url: "/pages/home/index"
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getItemData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/item",
            data: {
                m: "superman_hand2",
                act: "edit",
                id: t.data.itemId
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                a.itemId = a.id, delete a.id, t.setData({
                    itemData: a
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getCategoryData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/category",
            data: {
                m: "superman_hand2",
                act: "list"
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                t.setData({
                    Loading: !1,
                    categoryData: a.list
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    }
});