var app = getApp();

Page({
    data: {
        title: "开通会员",
        phoneNum: "",
        isVip: 0,
        welfareList: [],
        totalprice: 0,
        price: 99.00,
        oriPrice: 1999.00,
        userInfo: {},
    },
    onLoad: function (options)  {
        var o = this;
        o.setData({
            AppName: wx.getStorageSync("AppName"),
            ThemeStyle: app.getThemeStyle(),
            pageTitle: "开通会员",
            userInfo: wx.getStorageSync("userInfo"),
        });
        if (wx.getStorageSync("userInfo") ===""){
            var a = "/pages/member/index";
            return wx.navigateTo({
                url: "/pages/login/index?redirect=" + encodeURIComponent(a)
            });
        }
    },
    onShow: function () {
        console.log("onShow");
        var t = this;
        t.getVip();
    },
    bindInput: function (e) {
        var a = parseInt(e.currentTarget.dataset.type);
        1 == a ? this.setData({
            jhm: e.detail.value
        }) : 2 == a ? this.setData({
            phoneNum: e.detail.value
        }) : 3 == a ? this.setData({
            yqm: e.detail.value
        }) : 4 == a && this.setData({
            name: e.detail.value
        });
    },
    buyVIP: function (e) {
        var a = this, t = a.data.id, o = wx.getStorageSync("openid"), s = a.data.payType;
        var n = e.currentTarget.dataset.price;
        0 == n && (s = 2);
        var i = a.data.phoneNum;
        if (!i || "" == i) return wx.showModal({
            title: "提示信息",
            content: "请输入正确的手机号码",
            success: function (e) {
            }
        }), !1;
        a.toPay()
    },
    getVip: function () {
        var a = this, e = wx.getStorageSync("openid");
        console.log(e), app.util.request({
            url: "entry/wxapp/demo",
            showLoading: !1,
            data: {
                m: "superman_hand2",
                act: "isVip",
                openid: e
            },
            success: function (e) {
                console.log("获取vip数据"), console.log(e), a.setData({
                    isVip: e.data.data.vip_type,
                });
            }
        });
    },
    toPay: function (e) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/demo",
            data: {
                m: "superman_hand2",
                act: "payOrder",
                orderid: a.data.OrderId,
                openid: a.data.userInfo.memberInfo.openid,
                phone: a.data.phoneNum,
            },
            showLoading: !0,
            success: function (e) {
                console.log(e);
                e = e.data.data;
                wx.requestPayment({
                    timeStamp: e.timeStamp,
                    nonceStr: e.nonceStr,
                    package: e.package,
                    signType: e.signType,
                    paySign: e.paySign,
                    success: function (e) {
                        wx.showToast({
                            title: "支付成功"
                        }), setTimeout(function () {
                            wx.redirectTo({
                                url: "/pages/my/index"
                            });
                        }, 1e3);
                    },
                    fail: function (e) {
                        console.log(e);
                    }
                });
            },
            fail: function (e) {
                app.util.message(e.data.errmsg, "", "error");
            }
        });
    },
    toSign: function(a) {
        var o = this;
        wx.getStorageSync("userInfo") ? app.util.request({
            method: "POST",
            url: "entry/wxapp/my",
            data: {
                m: "superman_hand2",
                act: "sign_submit"
            },
            showLoading: !0,
            success: function(a) {
                console.log(a);
                a = a.data.data;
                o.setData({
                    signCreditValue: a.credit_value,
                    signDays: a.days,
                    showSignModal: !0,
                    "SignInfo.is_sign": !0
                });
            },
            fail: function(a) {
                var t;
                console.error(a), 31 == a.data.errno ? (t = a.data.data, o.setData({
                    signCreditValue: t.credit_value,
                    signDays: t.days,
                    showSignModal: !0,
                    "SignInfo.is_sign": !0
                })) : app.util.message(a.data.errmsg, "", "error");
            }
        }) : app.util.getUserInfo(function() {
            o.toSign(a);
        });
    },
});