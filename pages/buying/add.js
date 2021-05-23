var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0
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
        var e = this;
        app.getLocation(), e.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), e.data.userInfo ? (e.getIndexData(), e.getCategoryData(), app.viewCount()) : app.util.getUserInfo(function() {
            e.onLoad(a);
        });
    },
    getIndexData: function() {
        var e = this;
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
                a.buying.open ? a.need_mobile ? wx.showModal({
                    title: "系统提示",
                    content: "发布前需绑定手机号",
                    showCancel: !1,
                    success: function() {
                        wx.navigateTo({
                            url: "/pages/bind_phone/index?redirect=" + encodeURIComponent("/pages/buying/add")
                        });
                    }
                }) : (e.setData({
                    Loading: !1,
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
    getCategoryData: function() {
        var e = this;
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
                e.setData({
                    categoryData: a.list
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    }
});