var app = getApp();

Page({
    data: {
        balance: 0
    },
    onLoad: function() {
        var e = this;
        e.setData({
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle()
        }), app.util.request({
            url: "entry/wxapp/finance",
            data: {
                m: "superman_hand2"
            },
            fail: function(a) {
                console.log(a), wx.showModal({
                    title: "系统提示",
                    content: a.data.errmsg
                });
            },
            complete: function() {
                e.setData({
                    completed: !0
                });
            },
            success: function(a) {
                console.log(a);
                a = a.data.data;
                e.setData({
                    balance: a.balance,
                    currencyInfo: a.currency_info
                });
            }
        }), app.viewCount();
    },
    toGetcash: function() {
        "0.00" != this.data.balance && wx.redirectTo({
            url: "../getcash/index"
        });
    }
});