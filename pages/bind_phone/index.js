var app = getApp();

Page({
    data: {
        AssetsUrl: app.globalData.AssetsUrl,
        showAuth: !1,
        redirect: "/pages/my/index"
    },
    onLoad: function(e) {
        void 0 !== e.redirect && (this.data.redirect = decodeURIComponent(e.redirect)), 
        this.setData({
            ThemeStyle: app.getThemeStyle()
        }), app.viewCount();
    },
    saveNumber: function(e) {
        var a = this;
        "getPhoneNumber:ok" == e.detail.errMsg ? (a.data.showAuth && a.setData({
            showAuth: !1
        }), wx.checkSession({
            success: function() {
                app.util.request({
                    url: "entry/wxapp/item",
                    data: {
                        act: "get_phone_number",
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv,
                        m: "superman_hand2"
                    },
                    showLoading: !0,
                    success: function(e) {
                        console.log(e);
                        var t = e.data.data.purePhoneNumber, e = wx.getStorageSync("userInfo");
                        e.memberInfo.mobile = t, wx.setStorageSync("userInfo", e), wx.showToast({
                            title: "绑定成功"
                        }), setTimeout(function() {
                            wx.redirectTo({
                                url: a.data.redirect
                            });
                        }, 1500);
                    },
                    fail: function(e) {
                        app.util.message(e.data.errmsg, "", "error");
                    }
                });
            }
        })) : a.setData({
            showAuth: !0
        });
    },
    hideModal: function(e) {
        this.setData({
            showAuth: !1
        });
    }
});