var app = getApp();


Page({
    data: {
        userInfo:{}
    },
    onLoad: function (options) {
        var i = wx.getStorageSync("userInfo");
        this.setData({
            userInfo:i
        })
        this.toPay()
    },
    toPay: function(e) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/demo",
            data: {
                m: "superman_hand2",
                act: "payOrder",
                orderid: a.data.OrderId,
                openid: a.data.userInfo.memberInfo.openid,
            },
            showLoading: !0,
            success: function(e) {
                console.log(e);
                e = e.data.data;
                wx.requestPayment({
                    timeStamp: e.timeStamp,
                    nonceStr: e.nonceStr,
                    package: e.package,
                    signType: e.signType,
                    paySign: e.paySign,
                    success: function(e) {
                        wx.showToast({
                            title: "支付成功"
                        }), setTimeout(function() {
                            wx.redirectTo({
                                url: "../my_order/index?type=" + a.data.type
                            });
                        }, 1e3);
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                });
            },
            fail: function(e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
});