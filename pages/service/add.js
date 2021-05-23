var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        settingData: null,
        categoryData: []
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
        t.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle()
        }), t.data.userInfo ? (t.checkJoin(), app.viewCount()) : app.util.getUserInfo(function() {
            t.onLoad(a);
        });
    },
    checkJoin: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "is",
                op: "join"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a), a.data.data.service_id ? wx.redirectTo({
                    url: "/pages/service/admin"
                }) : (t.getLocation(), t.getSettingData(), t.getCategoryData());
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getLocation: function() {
        var o = this;
        app.getLocation(function() {
            var a, t = wx.getStorageSync("LocationInfo");
            t && (a = {
                address: t.address,
                lat: t.location.lat,
                lng: t.location.lng,
                province: t.address_component.province,
                city: t.address_component.city,
                district: t.address_component.district
            }, o.setData({
                locationInfo: a
            }), console.log("getLocation: init", t, a));
        });
    },
    getSettingData: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                t.setData({
                    settingData: a
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
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "category",
                op: "list"
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