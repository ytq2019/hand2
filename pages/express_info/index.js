var app = getApp(), Toast = require("../../libs/zanui/toast/toast");

Page({
    data: {
        expressList: app.globalData.expressList
    },
    onLoad: function(e) {
        e.orderid && this.getExpressInfo(e.orderid), this.setData({
            LoadingImg: wx.getStorageSync("LoadingImg"),
            ThemeStyle: app.getThemeStyle()
        }), app.viewCount();
    },
    getExpressInfo: function(e) {
        var t = this;
        app.util.request({
            method: "GET",
            url: "entry/wxapp/order",
            data: {
                act: "express_info",
                orderid: e,
                m: "superman_hand2"
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                var a = e.data.data.Traces, e = e.data.data.order;
                e.express_company = app.getExpressName(e.express_company), t.setData({
                    info: a && 0 < a.length ? a.reverse() : [],
                    order: e,
                    completed: !0
                });
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    }
});