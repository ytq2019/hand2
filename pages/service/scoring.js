var app = getApp();

Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        AssetsUrl: app.globalData.AssetsUrl,
        LogoUrl: app.globalData.LogoUrl,
        Loading: !0,
        settingData: null,
        serviceData: null
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
        e.setData({
            userInfo: wx.getStorageSync("userInfo"),
            ThemeStyle: app.getThemeStyle(),
            serviceId: a.id
        }), e.data.userInfo ? (e.getSettingData(), e.getIndexData(), app.viewCount()) : app.util.getUserInfo(function() {
            e.onLoad(a);
        });
    },
    getSettingData: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "setting"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                e.setData({
                    settingData: a
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "", "error");
            }
        });
    },
    getIndexData: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/service",
            data: {
                m: "superman_hand2",
                act: "score",
                service_id: e.data.serviceId
            },
            showLoading: !1,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                e.setData({
                    Loading: !1,
                    serviceData: a
                });
            },
            fail: function(a) {
                console.error(a), app.util.message(a.data.errmsg, "redirect:/pages/home/index", "error");
            }
        });
    },
    score: function(a) {
        app.util.message("评价成功，感谢您的支持！", "redirect:/pages/home/index", "error");
    }
});