var app = getApp();

Page({
    data: {
        redirect: "/pages/home/index"
    },
    onLoad: function(e) {
        var r = this;
        r.setData({
            canIUseGetUserProfile: wx.canIUse("getUserProfile"),
            LogoUrl: app.globalData.LogoUrl,
            ThemeStyle: app.getThemeStyle(),
            redirect: void 0 !== e.redirect ? decodeURIComponent(e.redirect) : r.data.redirect
        }), wx.getStorageSync("userInfo") ? wx.reLaunch({
            url: r.data.redirect
        }) : app.viewCount();
    },
    getUserProfile: function(e) {
        var r = this;
        wx.getUserProfile({
            desc: "用于登录",
            success: function(e) {
                app.util.getUserInfo(function() {
                    wx.redirectTo({
                        url: r.data.redirect
                    });
                }, e);
            },
            fail: function(e) {
                console.error(e), app.util.message("登录失败", "", "error");
            }
        });
    },
    getUserInfo: function(e) {
        var r = this;
        "getUserInfo:ok" == e.detail.errMsg ? app.util.getUserInfo(function() {
            wx.redirectTo({
                url: r.data.redirect
            });
        }, e.detail) : (app.superman.checkAuthorize("scope.userInfo"), console.log(e));
    }
});